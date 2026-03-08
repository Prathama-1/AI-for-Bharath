import boto3
import os
from dotenv import load_dotenv

load_dotenv()

def explore_dynamodb():
    print("--- AWS DynamoDB Explorer ---")
    
    # Initialize DynamoDB
    try:
        dynamodb = boto3.resource(
            'dynamodb',
            region_name=os.getenv("AWS_REGION", "us-east-1"),
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
        )
        
        # 1. List Tables
        client = boto3.client(
            'dynamodb',
            region_name=os.getenv("AWS_REGION", "us-east-1"),
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
        )
        
        tables = client.list_tables()['TableNames']
        if not tables:
            print("No tables found in your DynamoDB instance.")
            return

        print(f"Found {len(tables)} tables: {', '.join(tables)}")
        
        for table_name in tables:
            print(f"\n--- Exploring Table: {table_name} ---")
            table = dynamodb.Table(table_name)
            
            # 2. Describe Table (Check Keys)
            desc = client.describe_table(TableName=table_name)['Table']
            keys = [k['AttributeName'] for k in desc['KeySchema']]
            print(f"Primary Keys: {', '.join(keys)}")
            
            # 3. Check for Items/Parameters
            response = table.scan(Limit=5)
            items = response.get('Items', [])
            
            if not items:
                print("Table is empty (no items found).")
            else:
                print(f"Found {len(items)} sample items. Available parameters (attributes):")
                # Get all unique keys from the sample items
                attributes = set()
                for item in items:
                    attributes.update(item.keys())
                
                for attr in sorted(attributes):
                    print(f" - {attr}")
                
                print("\nSample Item Data:")
                import json
                print(json.dumps(items[0], indent=2, default=str))

    except Exception as e:
        print(f"Error connecting to DynamoDB: {e}")

if __name__ == "__main__":
    explore_dynamodb()
