import os
import django

# Set env vars explicitly for this script execution
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
os.environ['DATABASE_PASSWORD'] = '123'
os.environ['DATABASE_USER'] = 'postgres'
os.environ['DATABASE_NAME'] = 'store_db'
os.environ['DATABASE_HOST'] = 'localhost'
os.environ['DATABASE_PORT'] = '5432'

django.setup()

from django.contrib.sites.models import Site
from allauth.socialaccount.models import SocialApp

def setup_google_auth():
    print("Starting Google Auth Setup...")
    
    # 1. Configure Site
    # We use update_or_create to ensure we don't duplicate if ID 1 exists
    site, created = Site.objects.update_or_create(
        id=1,
        defaults={
            'domain': 'localhost:5176',
            'name': 'Guild Website'
        }
    )
    print(f"Site configured: {site.domain} (Created: {created})")

    # 2. Configure SocialApp
    client_id = "307624337498-s17dqjagub569k7gmkgl0ofqqdr4rrf5.apps.googleusercontent.com"
    secret = "dummy_secret" # Placeholder

    app, created = SocialApp.objects.get_or_create(
        provider='google',
        defaults={
            'name': 'Google',
            'client_id': client_id,
            'secret': secret,
        }
    )
    
    if not created:
        app.client_id = client_id
        app.secret = secret
        app.save()
        print("Updated existing Google SocialApp")
    else:
        print("Created new Google SocialApp")

    # Limit to site 1
    app.sites.add(site)
    print("Linked SocialApp to Site")

if __name__ == '__main__':
    setup_google_auth()
