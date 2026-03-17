import os
import django
from dotenv import load_dotenv

load_dotenv()

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_project.settings")
django.setup()

from store.models import Category

def check_categories():
    categories = Category.objects.all().values_list('name', flat=True)
    print("Categories currently in database:")
    for c in categories:
        print(f"- {c}")

if __name__ == '__main__':
    check_categories()
