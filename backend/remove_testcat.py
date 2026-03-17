
import os
import django
from dotenv import load_dotenv

load_dotenv()

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_project.settings")
django.setup()

from store.models import Category

def check_and_remove():
    try:
        cats = Category.objects.all()
        print("Current categories:")
        for c in cats:
            print(f"- {c.name} (id={c.id})")
            if c.name.lower() == 'testcat':
                print(f"FOUND 'testcat'! Deleting...")
                c.delete()
                print("Deleted 'testcat'.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    check_and_remove()
