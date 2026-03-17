import os
import django
from dotenv import load_dotenv

load_dotenv()
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_project.settings")
django.setup()

from seed_data import seed

if __name__ == '__main__':
    print("Starting seed...")
    try:
        seed()
        print("Seeding completed successfully.")
    except Exception as e:
        print(f"Seeding failed: {e}")
