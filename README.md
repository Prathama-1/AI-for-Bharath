# Medical Assistance Platform

FROM DIAGNOSIS TO FINANCIAL SUPPORT: A comprehensive healthcare technology solution that helps patients understand their medical conditions in simple language, discover financial aid eligibility, and generate claim assistance documents

## 🎯 Overview

The Medical Assistance Platform bridges the gap between complex medical terminology and patient understanding while facilitating access to government, state-level, and NGO financial aid schemes. The platform is built with React and designed to integrate seamlessly with AWS services for scalability and reliability.

## ✨ Key Features

### 1. Clinical Data Upload
- **Simple text-based uploads** for patient medical records
- **File upload support** for documents (TXT)
- **TEST INPUT**: Please use the [demo_clinical_data.txt](./demo_clinical_data.txt) file as a test input.
- **Secure storage** on AWS S3 with encryption
- **Progress tracking** for file uploads
- **Future enhancements**: Form-based input, Excel imports

### 2. Patient-Friendly Explanation
- **Automatic simplification** of medical jargon using Amazon Bedrock AI
- **Multi-language support** with 1 regional languages (Hindi)
- **Audio narration** for accessibility using browser speech synthesis
- **Copy-to-clipboard** functionality for easy sharing
- **Powered by**: Amazon Bedrock (AI) , NOVA 2 Lite

### 3. Financial Eligibility Matching
- **Automatic scheme matching** based on patient profile
- **Color-coded eligibility status** (Eligible, Partially Eligible, Not Eligible)
- **Comprehensive scheme database** with a few schemes in the DB for now
- **Powered by**: Amazon DynamoDB (scheme database) + custom rule-based logic

### 4. Claim Assistance PDF Generator
- **Professional document generation** with all relevant information
- **Includes**: Diagnosis summary, treatment details, eligibility status, next steps
- **Downloadable PDF** for hospital submission
- **Shareable document** for support centers and with doctors


## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm or pnpm package manager
- AWS account (for backend integration)

### Installation

```bash
# Install dependencies
pnpm install

# Start Local Environment (Run in separate terminals)
pnpm api    # Backend API (localhost:5000)
pnpm dev    # Frontend (localhost:3000)

```



## 📖 User Journey

1. **Home Page** - Learn about the platform and its features
2. **Clinical Upload** - Upload patient medical data
3. **Explanation** - Receive simplified medical explanation in preferred language
4. **Eligibility Check** - Discover available financial aid schemes
5. **PDF Generation** - Download claim assistance document

## 🔧 Technology Stack

### Frontend
- **React 19** - UI framework
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Component library
- **Wouter** - Client-side routing
- **Lucide React** - Icons

### Backend (AWS Integration)
- **Amazon S3** - Document storage
- **Amazon DynamoDB** - Scheme database
- **Amazon Bedrock** - AI/ML processing
- **Amazon Translate** - Language translation


## 🌍 Supported Languages

- English
- Hindi


## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request



## 🙏 Acknowledgments

- Built with React, Tailwind CSS, and shadcn/ui
- Powered by AWS services
- Designed with accessibility and empathy in mind

---

**Version**: 1.0.0  
