import os
import django
from django.conf import settings

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username_input = "suhankaminofficial@gmail.com"
password_input = "@897155Kavanamin"

print(f"Checking user: {username_input}")

# Check by username
try:
    user_by_username = User.objects.get(username=username_input)
    print(f"User found by username: {user_by_username}")
    if user_by_username.check_password(password_input):
        print("Password matches for user found by username.")
    else:
        print("Password DOES NOT match for user found by username.")
        # Reset password
        user_by_username.set_password(password_input)
        user_by_username.save()
        print("Password has been reset.")

except User.DoesNotExist:
    print("User not found by username.")

# Check by email
try:
    user_by_email = User.objects.get(email=username_input)
    print(f"User found by email: {user_by_email}")
    if user_by_email.check_password(password_input):
        print("Password matches for user found by email.")
    else:
        print("Password DOES NOT match for user found by email.")
        # Reset password
        user_by_email.set_password(password_input)
        user_by_email.save()
        print("Password has been reset.")

except User.DoesNotExist:
    print("User not found by email.")
except User.MultipleObjectsReturned:
    print("Multiple users found by email.")

