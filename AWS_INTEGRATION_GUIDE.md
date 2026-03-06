# AWS Integration Guide - Medical Assistance Platform

## Overview

This document provides detailed instructions for integrating the Medical Assistance Platform frontend with AWS services. The platform is designed to work with AWS Lambda, Amazon S3, Amazon Bedrock, Amazon Translate, and Amazon DynamoDB.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Frontend (This Project)                │
│  - Clinical Data Upload                                         │
│  - Patient-Friendly Explanation                                 │
│  - Financial Eligibility Matching                               │
│  - Claim Assistance PDF Generator                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    API Gateway / Lambda
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
   ┌────▼────┐        ┌─────▼──────┐      ┌─────▼──────┐
   │ Lambda  │        │  Bedrock   │      │ Translate  │
   │ Functions       │  (AI/ML)   │      │ (Languages)│
   └────┬────┘        └─────┬──────┘      └─────┬──────┘
        │                   │                    │
   ┌────▼──────────────────┬┴────────────────────▼────┐
   │                       │                          │
┌──▼──┐            ┌──────▼──────┐          ┌────────▼──┐
│ S3  │            │  DynamoDB   │          │ RDS/Other │
│     │            │  (Schemes)  │          │  Services │
└─────┘            └─────────────┘          └───────────┘
```

---

## Service Integration Details

### 1. AWS Lambda - Workflow Orchestration

**Purpose**: Execute core business logic for clinical data processing, eligibility checking, and PDF generation.

**Lambda Functions to Create**:

#### Function 1: `clinical-data-processor`
- **Trigger**: API Gateway POST `/api/upload`
- **Input**: Patient data, clinical information
- **Output**: Processed data ready for Bedrock
- **Runtime**: Node.js 18.x or Python 3.11
- **Environment Variables**:
  ```
  BEDROCK_MODEL_ID=anthropic.claude-v2
  S3_BUCKET=medical-platform-uploads
  DYNAMODB_TABLE=schemes-database
  ```

**Sample Lambda Handler (Node.js)**:
```javascript
const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const bedrock = new AWS.Bedrock();

exports.handler = async (event) => {
  try {
    const { patientName, patientAge, clinicalData } = JSON.parse(event.body);
    
    // Store original data in S3
    const s3Key = `uploads/${Date.now()}-${patientName}.json`;
    await s3.putObject({
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
      Body: JSON.stringify({ patientName, patientAge, clinicalData }),
      ContentType: 'application/json'
    }).promise();
    
    // Process with Bedrock for simplification
    const bedrockResponse = await bedrock.invokeModel({
      modelId: process.env.BEDROCK_MODEL_ID,
      body: JSON.stringify({
        prompt: `Simplify this medical information for a patient: ${clinicalData}`,
        max_tokens: 500
      })
    }).promise();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        s3Key,
        simplifiedExplanation: bedrockResponse.body
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

#### Function 2: `eligibility-checker`
- **Trigger**: API Gateway POST `/api/check-eligibility`
- **Input**: Patient profile (age, income, location)
- **Output**: List of eligible schemes with details
- **Runtime**: Node.js 18.x or Python 3.11
- **Environment Variables**:
  ```
  DYNAMODB_TABLE=schemes-database
  ```

**Sample Lambda Handler (Node.js)**:
```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { age, income, location, condition } = JSON.parse(event.body);
    
    // Query DynamoDB for matching schemes
    const params = {
      TableName: process.env.DYNAMODB_TABLE,
      FilterExpression: 'maxIncome >= :income AND minAge <= :age',
      ExpressionAttributeValues: {
        ':income': income,
        ':age': age
      }
    };
    
    const result = await dynamodb.scan(params).promise();
    
    // Categorize schemes by eligibility
    const eligible = result.Items.filter(scheme => 
      scheme.applicableStates.includes(location)
    );
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        eligible,
        totalBenefit: eligible.reduce((sum, s) => sum + s.maxBenefit, 0)
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

#### Function 3: `pdf-generator`
- **Trigger**: API Gateway POST `/api/generate-pdf`
- **Input**: Patient data, eligibility results, explanations
- **Output**: PDF file URL in S3
- **Runtime**: Node.js 18.x with pdf-lib or Python 3.11 with reportlab
- **Environment Variables**:
  ```
  S3_BUCKET=medical-platform-pdfs
  ```

---

### 2. Amazon S3 - Data Storage

**Buckets to Create**:

#### Bucket 1: `medical-platform-uploads`
- **Purpose**: Store uploaded clinical documents
- **Versioning**: Enabled
- **Encryption**: SSE-S3
- **Lifecycle Policy**:
  ```json
  {
    "Rules": [
      {
        "Id": "DeleteOldUploads",
        "Status": "Enabled",
        "ExpirationInDays": 90,
        "NoncurrentVersionExpirationInDays": 30
      }
    ]
  }
  ```

#### Bucket 2: `medical-platform-pdfs`
- **Purpose**: Store generated claim PDFs
- **Versioning**: Enabled
- **Encryption**: SSE-S3
- **Public Access**: Block all (use pre-signed URLs)
- **CORS Configuration**:
  ```json
  [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT"],
      "AllowedOrigins": ["https://yourdomain.com"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3000
    }
  ]
  ```

---

### 3. Amazon Bedrock - AI/ML Processing

**Model Setup**:
- **Model**: Anthropic Claude v2 (or latest available)
- **Request Format**:
  ```json
  {
    "prompt": "Simplify this medical term: [TERM] in simple language suitable for a patient",
    "max_tokens": 500,
    "temperature": 0.7
  }
  ```

**Use Cases**:
1. **Clinical Data Simplification**: Convert medical jargon to patient-friendly language
2. **Diagnosis Explanation**: Generate comprehensive explanations
3. **Treatment Recommendations**: Create actionable next steps

**Integration Code (Node.js)**:
```javascript
const AWS = require('aws-sdk');
const bedrock = new AWS.Bedrock({ region: 'us-east-1' });

async function simplifyMedicalTerm(term) {
  const response = await bedrock.invokeModel({
    modelId: 'anthropic.claude-v2',
    body: JSON.stringify({
      prompt: `Simplify this medical term for a patient: ${term}`,
      max_tokens: 200
    })
  }).promise();
  
  return JSON.parse(response.body.toString()).completion;
}
```

---

### 4. Amazon Translate - Language Support

**Supported Languages** (configured in frontend):
- Hindi (hi)
- Tamil (ta)
- Telugu (te)
- Kannada (kn)
- Malayalam (ml)
- Marathi (mr)
- Gujarati (gu)

**Integration Code (Node.js)**:
```javascript
const AWS = require('aws-sdk');
const translate = new AWS.Translate();

async function translateText(text, targetLanguage) {
  const response = await translate.translateText({
    Text: text,
    SourceLanguageCode: 'en',
    TargetLanguageCode: targetLanguage
  }).promise();
  
  return response.TranslatedText;
}
```

---

### 5. Amazon DynamoDB - Scheme Database

**Table Schema**:

```
TableName: schemes-database

Attributes:
- schemeId (String, Partition Key)
- schemeName (String)
- provider (String) - Government, State, NGO
- description (String)
- maxBenefit (Number)
- minIncome (Number)
- maxIncome (Number)
- applicableStates (StringSet)
- requirements (StringSet)
- applicationProcess (String)
- contactInfo (String)
- eligibilityRules (Map)

Global Secondary Index:
- providerIndex: provider (Partition Key), schemeName (Sort Key)
- stateIndex: applicableStates (Partition Key)
```

**Sample Data**:
```json
{
  "schemeId": "PMJAY-001",
  "schemeName": "Ayushman Bharat - PMJAY",
  "provider": "Government",
  "description": "National health protection scheme",
  "maxBenefit": 500000,
  "minIncome": 0,
  "maxIncome": 500000,
  "applicableStates": ["All States"],
  "requirements": [
    "Annual family income below 5 lakhs",
    "Registered under SECC database",
    "Valid Aadhaar card"
  ],
  "applicationProcess": "Visit nearest PMJAY enrollment center",
  "contactInfo": "1800-180-1104"
}
```

---

## API Gateway Configuration

**Base URL**: `https://api.yourdomain.com`

**Endpoints**:

| Method | Endpoint | Lambda Function | Description |
|--------|----------|-----------------|-------------|
| POST | `/api/upload` | clinical-data-processor | Upload clinical data |
| GET | `/api/explanation/{id}` | get-explanation | Retrieve simplified explanation |
| POST | `/api/check-eligibility` | eligibility-checker | Check scheme eligibility |
| POST | `/api/generate-pdf` | pdf-generator | Generate claim PDF |
| GET | `/api/schemes` | list-schemes | List all available schemes |

---

## Environment Variables

Create a `.env` file in the project root:

```
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_AWS_REGION=us-east-1
VITE_S3_BUCKET=medical-platform-pdfs
VITE_BEDROCK_MODEL_ID=anthropic.claude-v2
```

---

## Security Best Practices

1. **IAM Roles**: Create specific roles for each Lambda function with minimal permissions
2. **Encryption**: Enable encryption at rest for S3 and DynamoDB
3. **VPC**: Deploy Lambda functions in VPC for database access
4. **API Keys**: Implement API key authentication for API Gateway
5. **CORS**: Restrict CORS to your domain only
6. **Data Privacy**: Implement HIPAA compliance measures
7. **Audit Logging**: Enable CloudTrail for all AWS service calls

---

## Deployment Steps

### 1. Create IAM Roles
```bash
# Create Lambda execution role
aws iam create-role --role-name medical-platform-lambda-role \
  --assume-role-policy-document file://trust-policy.json

# Attach policies
aws iam attach-role-policy --role-name medical-platform-lambda-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

### 2. Create S3 Buckets
```bash
aws s3 mb s3://medical-platform-uploads --region us-east-1
aws s3 mb s3://medical-platform-pdfs --region us-east-1
```

### 3. Create DynamoDB Table
```bash
aws dynamodb create-table \
  --table-name schemes-database \
  --attribute-definitions AttributeName=schemeId,AttributeType=S \
  --key-schema AttributeName=schemeId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### 4. Deploy Lambda Functions
```bash
# Package and deploy
zip -r lambda-function.zip index.js node_modules/

aws lambda create-function \
  --function-name clinical-data-processor \
  --runtime nodejs18.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/medical-platform-lambda-role \
  --handler index.handler \
  --zip-file fileb://lambda-function.zip
```

### 5. Configure API Gateway
```bash
# Create API
aws apigateway create-rest-api --name medical-platform-api

# Create resources and methods
# (Use AWS Console for detailed configuration)
```

---

## Testing

### Local Testing
```bash
# Install AWS SAM CLI
pip install aws-sam-cli

# Run Lambda locally
sam local start-api

# Test endpoints
curl -X POST http://localhost:3000/api/upload \
  -H "Content-Type: application/json" \
  -d '{"patientName":"John","patientAge":45,"clinicalData":"..."}'
```

### Integration Testing
```bash
# Test with actual AWS services
npm run test:integration
```

---

## Monitoring & Logging

### CloudWatch Dashboards
- Create dashboard for Lambda execution metrics
- Monitor error rates and latency
- Set up alarms for failures

### CloudTrail Logging
- Enable for audit compliance
- Track all API calls and data access

### X-Ray Tracing
- Enable X-Ray for Lambda functions
- Trace requests through the system

---

## Cost Optimization

1. **Lambda**: Use provisioned concurrency for predictable traffic
2. **S3**: Use Intelligent-Tiering for automatic cost optimization
3. **DynamoDB**: Use on-demand billing for variable traffic
4. **Data Transfer**: Minimize cross-region data transfer

---

## Troubleshooting

### Common Issues

**Issue**: Lambda timeout
- **Solution**: Increase timeout in Lambda configuration (max 15 minutes)

**Issue**: S3 access denied
- **Solution**: Verify IAM role has S3 permissions

**Issue**: Bedrock model not available
- **Solution**: Verify model is available in your region

**Issue**: DynamoDB throttling
- **Solution**: Increase provisioned capacity or use on-demand billing

---

## Support & Resources

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [Amazon Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [AWS DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)
- [AWS Translate Documentation](https://docs.aws.amazon.com/translate/)

---

## Next Steps

1. Set up AWS account and configure credentials
2. Create all required AWS resources
3. Deploy Lambda functions
4. Configure API Gateway endpoints
5. Update frontend environment variables
6. Test end-to-end workflow
7. Deploy frontend to production
8. Monitor and optimize performance

---

**Last Updated**: March 2, 2026
**Version**: 1.0.0
