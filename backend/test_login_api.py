import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

url = "http://127.0.0.1:8000/api/auth/login/"
payload = {
    "username": os.getenv('DEBUG_USER_EMAIL', 'debug@example.com'),
    "password": os.getenv('DEBUG_USER_PASSWORD', 'debugpass')
}
headers = {
    "Content-Type": "application/json"
}

try:
    print(f"Sending POST to {url} with payload: {payload}")
    response = requests.post(url, json=payload, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
