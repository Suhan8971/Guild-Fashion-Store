import requests

url = "http://127.0.0.1:8000/api/auth/register/"

print("TEST 1: Registration with MISMATCHING passwords")
data_mismatch = {
    "username": "mismatch_user",
    "email": "mismatch_test@example.com",
    "password": "SecurePassword123",
    "confirm_password": "WrongPassword123"
}
res_mismatch = requests.post(url, json=data_mismatch)
print(f"Status Code: {res_mismatch.status_code}")
print(f"Response: {res_mismatch.json()}")
print("-" * 50)

print("TEST 2: Registration with MATCHING passwords")
data_match = {
    "username": "matching_user",
    "email": "matching_test@example.com",
    "password": "SecurePassword123",
    "confirm_password": "SecurePassword123"
}
res_match = requests.post(url, json=data_match)
print(f"Status Code: {res_match.status_code}")
print(f"Response: {res_match.json()}")
print("-" * 50)

print("TEST 3: Request Password Reset token")
reset_url = "http://127.0.0.1:8000/api/auth/password/reset/"
reset_data = {
    "email": "matching_test@example.com"
}
res_reset = requests.post(reset_url, json=reset_data)
# Because an email is likely required to be valid, this might hang or crash if SMTP isn't set,
# but let's check the API response. 
print(f"Status Code: {res_reset.status_code}")
# Response might be empty or success text
try:
    print(f"Response: {res_reset.json()}")
except Exception as e:
    print(f"Response Text (non-JSON): {res_reset.text}")
print("-" * 50)
