import os
import django
import sys

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

email = "suhankaminofficial@gmail.com"
try:
    user = User.objects.get(email=email)
    print(f"User found: {user.username} (Role: {user.role})")
    print(f"Is Active: {user.is_active}")
    print(f"Has Usable Password: {user.has_usable_password()}")
except User.DoesNotExist:
    print(f"User with email {email} NOT FOUND!")
