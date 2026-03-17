import requests
import json

url = "http://127.0.0.1:8000/api/auth/login/"
payload = {
    "username": "suhankaminofficial@gmail.com",
    "password": "@897155Kavanamin"
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
