import boto3
import os
from dotenv import load_dotenv

load_dotenv()

def seed_schemes():
    print("--- Seeding DynamoDB with Medical Schemes ---")
    
    # Initialize DynamoDB
    dynamodb = boto3.resource(
        'dynamodb',
        region_name=os.getenv("AWS_REGION", "us-east-1"),
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
    )
    
    # Table name (Must match what user created in AWS Console)
    TABLE_NAME = "medical-schemes" 
    
    try:
        table = dynamodb.Table(TABLE_NAME)
        
        schemes = [
            {
                "scheme-id": "PMJAY_001",
                "name": "Ayushman Bharat - PMJAY",
                "authority": "Government of India",
                "description": "National health protection scheme providing cashless hospitalization benefits.",
                "benefit": "₹5,00,000 per year",
                "max_income": 10000,
                "is_rural_only": False,
                "excluded_assets": ["motor_vehicle", "refrigerator", "pucca_house"],
                "required_ration_cards": ["bpl", "antyodaya"]
            },
            {
                "scheme-id": "SR_CITIZEN_001",
                "name": "PMJAY Senior Citizen Cover",
                "authority": "Government of India",
                "description": "Universal health coverage for all seniors above 70 years.",
                "benefit": "₹5,00,000 per year",
                "min_age": 70,
                "is_rural_only": False
            }
        ]

        print(f"Uploading {len(schemes)} schemes to '{TABLE_NAME}'...")
        
        with table.batch_writer() as batch:
            for scheme in schemes:
                batch.put_item(Item=scheme)
        
        print("Successfully seeded database!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        print("\nTIP: Make sure you have created a table named 'MedicalSchemes' with 'scheme_id' as the Partition Key.")

if __name__ == "__main__":
    seed_schemes()
