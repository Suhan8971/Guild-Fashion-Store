import os
import django
from dotenv import load_dotenv

load_dotenv()

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_project.settings")
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
password = os.getenv('DJANGO_SUPERUSER_PASSWORD', 'admin123')
role = 'admin'

if not User.objects.filter(username=username).exists():
    print(f"Creating superuser: {username}")
    User.objects.create_superuser(username=username, email=email, password=password, role=role)
    print("Superuser created successfully.")
else:
    print(f"Superuser {username} already exists.")
