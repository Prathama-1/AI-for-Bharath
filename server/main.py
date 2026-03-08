import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS for local development (Vite runs on 3000/3001)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Python API for Medical Assistance Platform is running!"}

s3_client = boto3.client(
    "s3",
    region_name=os.getenv("AWS_REGION", "us-east-1"),
    config=Config(signature_version="s3v4"),
)

translate_client = boto3.client(
    "translate",
    region_name=os.getenv("AWS_REGION", "us-east-1"),
)

# Bedrock Client for AI Analysis
bedrock_client = boto3.client(
    "bedrock-runtime",
    region_name=os.getenv("AWS_REGION", "us-east-1"),
)

# DynamoDB Resource
dynamodb = boto3.resource(
    "dynamodb",
    region_name=os.getenv("AWS_REGION", "us-east-1"),
)

class AnalyzeRequest(BaseModel):
    key: str

class TranslateRequest(BaseModel):
    text: str
    target_lang: str

class EligibilityRequest(BaseModel):
    income: int
    is_rural: bool
    occupation: str
    age: int
    has_motor_vehicle: bool = False
    has_refrigerator: bool = False
    has_landline: bool = False
    has_pucca_house: bool = False
    is_sc_st: bool = False
    ration_card: str = "none" # bpl, apl, antyodaya, none

@app.post("/api/eligibility")
async def check_eligibility(request: EligibilityRequest):
    """
    Checks eligibility for government health schemes based on live DynamoDB data.
    """
    try:
        table = dynamodb.Table("medical-schemes")
        response = table.scan()
        db_schemes = response.get('Items', [])
        
        results = []
        for scheme in db_schemes:
            name = scheme.get("name", "Unknown Scheme")
            res = {
                "id": scheme.get("scheme-id", "unknown"),
                "name": name,
                "authority": scheme.get("authority", "Government"),
                "description": scheme.get("description", ""),
                "benefit": scheme.get("benefit", "N/A"),
                "status": "Not Eligible",
                "reasons": []
            }

            # 1. Age Check
            min_age = int(scheme.get("min_age", 0))
            if min_age > 0:
                if request.age >= min_age:
                    res["status"] = "Eligible"
                    res["reasons"].append(f"Automatic eligibility based on age ({request.age}+)")
                    results.append(res)
                    continue # Senior citizen covers often skip asset checks
                else:
                    res["reasons"].append(f"Does not meet minimum age requirement ({min_age})")

            # 2. Asset/Income Exclusion Check
            excluded_assets = scheme.get("excluded_assets", [])
            max_income = int(scheme.get("max_income", 9999999))
            
            rejection_reasons = []
            if request.income > max_income:
                rejection_reasons.append(f"Income ₹{request.income} exceeds threshold ₹{max_income}")
            
            if "motor_vehicle" in excluded_assets and request.has_motor_vehicle:
                rejection_reasons.append("Ownership of motorized vehicle")
            if "refrigerator" in excluded_assets and request.has_refrigerator:
                rejection_reasons.append("Ownership of refrigerator")
            if "pucca_house" in excluded_assets and request.has_pucca_house:
                rejection_reasons.append("Residing in pucca house")

            if rejection_reasons:
                res["status"] = "Not Eligible"
                res["reasons"].extend(rejection_reasons)
            else:
                # 3. Inclusion Logic
                is_eligible = False
                
                # Check Geography
                is_rural_only = scheme.get("is_rural_only", False)
                if is_rural_only and not request.is_rural:
                    res["reasons"].append("Scheme limited to rural households")
                else:
                    # Check Ration Card
                    required_cards = scheme.get("required_ration_cards", [])
                    if required_cards and request.ration_card in required_cards:
                        is_eligible = True
                        res["reasons"].append(f"Ration card ({request.ration_card}) meets eligibility criteria")
                    
                    # Check SC/ST
                    if request.is_sc_st and request.is_rural:
                        is_eligible = True
                        res["reasons"].append("Priority inclusion for rural SC/ST households")

                if is_eligible:
                    res["status"] = "Eligible"
                else:
                    res["status"] = "Partial Match"
                    res["reasons"].append("Meeting asset criteria, but direct SECC verification required")

            results.append(res)

        return {"schemes": results}

    except Exception as e:
        print(f"DynamoDB Error: {e}")
        raise HTTPException(status_code=500, detail="Database connection failed")

@app.get("/api/upload-url")
async def get_upload_url(filename: str, contentType: str):
    """
    Generates a presigned URL to upload a file directly to S3.
    """
    bucket_name = os.getenv("S3_BUCKET_NAME")
    if not bucket_name:
        raise HTTPException(status_code=500, detail="S3_BUCKET_NAME not configured")

    key = f"uploads/{filename}"

    try:
        presigned_url = s3_client.generate_presigned_url(
            "put_object",
            Params={
                "Bucket": bucket_name,
                "Key": key,
                "ContentType": contentType,
            },
            ExpiresIn=3600,
        )
        return {"url": presigned_url, "key": key}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze")
async def analyze_file(request_data: AnalyzeRequest):
    """
    Reads a file from S3 and uses Amazon Bedrock (Nova 2 Lite) to analyze medical terms.
    Includes a MOCK_AI fallback for development.
    """
    bucket_name = os.getenv("S3_BUCKET_NAME")
    is_mock_env = os.getenv("MOCK_AI", "false").lower() == "true"

    if is_mock_env:
        return {
            "results": [
                {
                    "medicalTerm": "Hypertension",
                    "simplifiedExplanation": "High blood pressure",
                    "whatItMeans": "Your blood is pushing too hard against the walls of your blood vessels.",
                    "whyItMatters": "If left untreated, it can damage your heart and kidneys.",
                    "nextSteps": "Monitor daily and reduce salt."
                }
            ]
        }

    try:
        # 1. Fetch file content from S3
        response = s3_client.get_object(Bucket=bucket_name, Key=request_data.key)
        file_content = response['Body'].read().decode('utf-8')

        # 2. Prepare Bedrock Call (Amazon Nova 2 Lite - US Inference Profile)
        model_id = "us.amazon.nova-2-lite-v1:0"
        print(f"DEBUG: Using Bedrock model_id: {model_id}")
        
        system_prompt = (
            "You are an empathetic healthcare assistant. Analyze the medical text and extract important terms. "
            "Return ONLY a JSON list of objects with keys: 'medicalTerm', 'simplifiedExplanation', 'whatItMeans', 'whyItMatters', 'nextSteps'. "
            "Do not include markdown or explanations outside the JSON."
        )
        
        user_message = f"Analyze this report:\n\n{file_content}"

        # Using the Bedrock Converse API
        response = bedrock_client.converse(
            modelId=model_id,
            messages=[{"role": "user", "content": [{"text": user_message}]}],
            system=[{"text": system_prompt}],
            inferenceConfig={"temperature": 0.2, "maxTokens": 2000}
        )
        
        # 3. Parse response
        output_text = response['output']['message']['content'][0]['text']
        
        # Strip potential markdown backticks if Nova includes them
        if "```json" in output_text:
            output_text = output_text.split("```json")[1].split("```")[0].strip()
        elif "```" in output_text:
            output_text = output_text.split("```")[1].split("```")[0].strip()

        analysis_result = json.loads(output_text)
        return {"results": analysis_result}

    except Exception as e:
        print(f"Bedrock/S3 Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/translate")
async def translate_text(request: TranslateRequest):
    """
    Translates text to the target language using AWS Translate.
    Includes a mock fallback if MOCK_AI is enabled.
    """
    is_mock = os.getenv("MOCK_AI", "false").lower() == "true"
    
    if is_mock:
        # Simple mock translation for Hindi (Static for demo)
        # In a real mock, we could use a dictionary or just return the same text
        # But for rural people demo, we just need it to look translated.
        mock_hindi = {
            "Hypertension": "उच्च रक्तचाप (Hypertension)",
            "High blood pressure": "उच्च रक्तचाप",
            "Your blood is pushing too hard against the walls of your blood vessels. Think of it like water pressure in a hose that's too high.": "आपका रक्त आपकी रक्त वाहिकाओं की दीवारों पर बहुत ज़ोर से दबाव डाल रहा है। इसे नली में पानी के दबाव की तरह समझें जो बहुत अधिक है।",
            "If left untreated, high blood pressure can damage your heart, kidneys, and brain over time.": "यदि उपचार न किया जाए, तो उच्च रक्तचाप समय के साथ आपके हृदय, गुर्दे और मस्तिष्क को नुकसान पहुँचा सकता है।",
            "Monitor your blood pressure daily, reduce salt intake, and follow up with your primary doctor.": "प्रतिदिन अपने रक्तचाप की निगरानी करें, नमक का सेवन कम करें और अपने प्राथमिक डॉक्टर से संपर्क करें।",
            "Medical Term": "चिकित्सा शब्द",
            "What It Means": "इसका क्या मतलब है",
            "Why It Matters": "यह क्यों महत्वपूर्ण है",
            "Recommended Next Steps": "अनुशंसित अगले कदम",
            "Simplified Explanation": "सरलीकृत व्याख्या"
        }
        # Fallback to a simple string if not in mock map
        return {"translatedText": mock_hindi.get(request.text, f"[Translated to {request.target_lang}]: {request.text}")}

    try:
        response = translate_client.translate_text(
            Text=request.text,
            SourceLanguageCode="en",
            TargetLanguageCode=request.target_lang
        )
        return {"translatedText": response['TranslatedText']}
    except Exception as e:
        print(f"Translation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
