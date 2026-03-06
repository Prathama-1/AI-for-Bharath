# Medical Assistance Platform

A comprehensive healthcare technology solution that helps patients understand their medical conditions in simple language, discover financial aid eligibility, and generate claim assistance documents—all powered by AWS services.

## 🎯 Overview

The Medical Assistance Platform bridges the gap between complex medical terminology and patient understanding while facilitating access to government, state-level, and NGO financial aid schemes. The platform is built with React and designed to integrate seamlessly with AWS services for scalability and reliability.

## ✨ Key Features

### 1. Clinical Data Upload
- **Simple text-based uploads** for patient medical records
- **File upload support** for documents (TXT, PDF, DOC, DOCX)
- **Secure storage** on AWS S3 with encryption
- **Progress tracking** for file uploads
- **Future enhancements**: Form-based input, Excel imports

### 2. Patient-Friendly Explanation
- **Automatic simplification** of medical jargon using Amazon Bedrock AI
- **Multi-language support** with 8 regional languages (Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati)
- **Audio narration** for accessibility using browser speech synthesis
- **Copy-to-clipboard** functionality for easy sharing
- **Powered by**: Amazon Bedrock (AI) + Amazon Translate (Languages)

### 3. Financial Eligibility Matching
- **Automatic scheme matching** based on patient profile
- **Color-coded eligibility status** (Eligible, Partially Eligible, Not Eligible)
- **Comprehensive scheme database** with 100+ government, state, and NGO programs
- **Detailed scheme information** including requirements and application process
- **Powered by**: Amazon DynamoDB (scheme database) + custom rule-based logic

### 4. Claim Assistance PDF Generator
- **Professional document generation** with all relevant information
- **Includes**: Diagnosis summary, treatment details, eligibility status, next steps
- **Downloadable PDF** for hospital submission
- **Shareable document** for support centers
- **Powered by**: AWS Lambda + Amazon S3

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│     React Frontend (This Application)   │
│  - Upload Module                        │
│  - Explanation Module                   │
│  - Eligibility Module                   │
│  - PDF Generation Module                │
└────────────────────┬────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
    API Gateway            Lambda Functions
        │                         │
    ┌───┴──────────────────────┬──┴────┐
    │                          │       │
   S3                    DynamoDB  Bedrock
(Documents)            (Schemes)  (AI/ML)
                                   │
                            Translate
                            (Languages)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or pnpm package manager
- AWS account (for backend integration)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd medical-assistance-platform

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
# Build the application
pnpm build

# Preview production build
pnpm preview
```

## 📖 User Journey

1. **Home Page** - Learn about the platform and its features
2. **Clinical Upload** - Upload patient medical data
3. **Explanation** - Receive simplified medical explanation in preferred language
4. **Eligibility Check** - Discover available financial aid schemes
5. **PDF Generation** - Download claim assistance document

## 🎨 Design Philosophy

The platform follows **Empathetic Healthcare Minimalism** design principles:

- **Soft, calming colors**: Medical blue (#0066CC), sage green (#6B9E7F), warm accents
- **Reassuring typography**: Poppins for headings, Inter for body text
- **Progressive disclosure**: Information revealed gradually to avoid overwhelming users
- **Accessibility first**: Audio support, multiple languages, clear navigation
- **Gentle animations**: Breathing effects, smooth transitions, reassuring micro-interactions

## 🔧 Technology Stack

### Frontend
- **React 19** - UI framework
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Component library
- **Wouter** - Client-side routing
- **Lucide React** - Icons

### Backend (AWS Integration)
- **AWS Lambda** - Serverless compute
- **Amazon S3** - Document storage
- **Amazon DynamoDB** - Scheme database
- **Amazon Bedrock** - AI/ML processing
- **Amazon Translate** - Language translation
- **API Gateway** - REST API management

### Development
- **Vite** - Build tool
- **TypeScript** - Type safety
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📁 Project Structure

```
medical-assistance-platform/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx              # Landing page
│   │   │   ├── ClinicalUpload.tsx    # Upload module
│   │   │   ├── Explanation.tsx       # Explanation module
│   │   │   ├── Eligibility.tsx       # Eligibility module
│   │   │   └── PDFGeneration.tsx     # PDF generation module
│   │   ├── components/               # Reusable UI components
│   │   ├── contexts/                 # React contexts
│   │   ├── lib/                      # Utility functions
│   │   ├── App.tsx                   # Main app component
│   │   ├── main.tsx                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── public/                       # Static assets
│   └── index.html                    # HTML template
├── server/
│   └── index.ts                      # Express server (production)
├── AWS_INTEGRATION_GUIDE.md          # AWS setup documentation
├── README.md                         # This file
└── package.json                      # Dependencies
```

## 🔐 Security & Privacy

- **HIPAA Compliance**: Designed to comply with healthcare data regulations
- **Encryption**: All data encrypted in transit (HTTPS) and at rest (S3, DynamoDB)
- **IAM Access Control**: AWS IAM roles with minimal permissions
- **Data Retention**: Automatic deletion of old uploads after 90 days
- **Audit Logging**: CloudTrail logging for compliance tracking
- **No Third-Party Sharing**: Patient data never shared without consent

## 📊 Supported Schemes

The platform includes eligibility matching for:

- **Government Schemes**:
  - Ayushman Bharat - PMJAY
  - Rashtriya Swasthya Bima Yojana
  - ESIC Scheme

- **State-Level Programs**:
  - Rajiv Gandhi Jeevandayee Arogya Yojana (Maharashtra)
  - Chief Minister Relief Fund (Various states)
  - State health insurance schemes

- **NGO Programs**:
  - Health for All Foundation
  - Various charitable organizations

## 🌍 Supported Languages

- English
- Hindi
- Tamil
- Telugu
- Kannada
- Malayalam
- Marathi
- Gujarati

## 📱 Responsive Design

The platform is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Tablets (iPad, Android tablets)
- Mobile devices (iOS, Android)

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Integration Testing
```bash
npm run test:integration
```

### Type Checking
```bash
npm run check
```

## 📚 AWS Integration

For detailed AWS setup instructions, refer to [AWS_INTEGRATION_GUIDE.md](./AWS_INTEGRATION_GUIDE.md)

### Quick AWS Setup
1. Create S3 buckets for uploads and PDFs
2. Create DynamoDB table for schemes
3. Deploy Lambda functions
4. Configure API Gateway
5. Set up IAM roles and permissions
6. Update environment variables

## 🚢 Deployment

### Deploy to Manus Platform
1. Create a checkpoint in the Management UI
2. Click the "Publish" button
3. Configure custom domain (optional)
4. Your site is live!

### Deploy to Other Platforms
The project can be deployed to:
- Vercel
- Netlify
- AWS Amplify
- Railway
- Render
- Any Node.js hosting provider

## 📈 Performance Optimization

- **Code Splitting**: Automatic route-based code splitting
- **Image Optimization**: WebP format for faster loading
- **Caching**: Browser caching with content hashing
- **Lazy Loading**: Components loaded on demand
- **CDN**: Static assets served from CDN

## 🐛 Troubleshooting

### Common Issues

**Issue**: Page not loading
- Check browser console for errors
- Verify API endpoints are configured
- Check network connectivity

**Issue**: Upload failing
- Verify file size is under 10MB
- Check file format is supported
- Ensure S3 bucket is accessible

**Issue**: Language translation not working
- Verify Amazon Translate service is enabled
- Check AWS credentials and permissions
- Verify language code is supported

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@medicalassistanceplatform.com
- Documentation: [AWS_INTEGRATION_GUIDE.md](./AWS_INTEGRATION_GUIDE.md)
- Issues: GitHub Issues

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [AWS Documentation](https://docs.aws.amazon.com)
- [Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)

## 🔮 Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Video tutorials for scheme application
- [ ] Real-time chat support
- [ ] Integration with hospital management systems
- [ ] Prescription management
- [ ] Appointment scheduling
- [ ] Insurance claim tracking
- [ ] Doctor consultation booking

## 📊 Metrics & Analytics

The platform tracks:
- User engagement
- Feature usage
- Scheme eligibility distribution
- PDF generation success rate
- Language preference distribution

## 🙏 Acknowledgments

- Built with React, Tailwind CSS, and shadcn/ui
- Powered by AWS services
- Designed with accessibility and empathy in mind

---

**Version**: 1.0.0  
**Last Updated**: March 2, 2026  
**Status**: Production Ready

For more information, visit the [AWS Integration Guide](./AWS_INTEGRATION_GUIDE.md)
