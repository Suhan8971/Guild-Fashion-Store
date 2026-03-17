import os
import django
from dotenv import load_dotenv

load_dotenv()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from store.models import Category

REQUIRED_CATEGORIES = ['Shirt', 'Pant', 'T-Shirt', 'Lower']

def ensure_categories():
    print("Checking categories...")
    for name in REQUIRED_CATEGORIES:
        slug = name.lower().replace(' ', '-')
        category, created = Category.objects.get_or_create(
            slug=slug,
            defaults={'name': name}
        )
        if created:
            print(f"Created category: {name}")
        else:
            print(f"Category already exists: {name}")

if __name__ == '__main__':
    ensure_categories()
    
    # Remove testcat if it exists
    try:
        Category.objects.get(slug='testcat').delete()
        print("Deleted category: testcat")
    except Category.DoesNotExist:
        pass
