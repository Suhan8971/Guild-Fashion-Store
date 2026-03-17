import os
import django
from dotenv import load_dotenv

load_dotenv()

# Check manage.py to see the correct settings module
import sys
# Add the current directory to sys.path
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings') # Verify if this is correct by listing dir
django.setup()

from store.models import Category

for name in ['Shirt', 'T-Shirt']:
    slug = name.lower()
    cat, created = Category.objects.get_or_create(slug=slug, defaults={'name': name})
    if created:
        print(f"Created category: {name}")
    else:
        print(f"Category already exists: {name}")

