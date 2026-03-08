import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import boto3
from botocore.config import Config
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
    # Access keys will be picked up from .env or AWS CLI config automatically
)

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

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
