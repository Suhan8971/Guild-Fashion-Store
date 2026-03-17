import os
import django
from django.utils.text import slugify
from dotenv import load_dotenv

load_dotenv()

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_project.settings")
django.setup()

from store.models import Category

def update_categories():
    # Map old names to new names
    # Tops -> Shirt
    # Bottoms -> Pant
    # Outerwear -> Lower
    # Accessories -> Tshirt
    
    mapping = {
        'Tops': 'Shirt',
        'Bottoms': 'Pant',
        'Outerwear': 'Lower',
        'Accessories': 'T-Shirt',
        'Tshirt': 'T-Shirt'  # Handle previous mapping if run multiple times
    }

    for old_name, new_name in mapping.items():
        try:
            cat = Category.objects.get(name=old_name)
            cat.name = new_name
            cat.slug = slugify(new_name)
            cat.save()
            print(f"Renamed {old_name} to {new_name}")
        except Category.DoesNotExist:
            print(f"Category {old_name} not found. Checking if {new_name} already exists...")
            if Category.objects.filter(name=new_name).exists():
                 print(f"Category {new_name} already exists.")
            else:
                print(f"Creating {new_name}...")
                Category.objects.create(name=new_name, slug=slugify(new_name))

if __name__ == '__main__':
    update_categories()
