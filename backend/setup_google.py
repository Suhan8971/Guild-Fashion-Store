import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from django.contrib.sites.models import Site
from allauth.socialaccount.models import SocialApp

def setup_google_auth():
    # 1. Configure Site
    site, created = Site.objects.get_or_create(id=1)
    site.domain = 'localhost:5176'
    site.name = 'Guild Website'
    site.save()
    print(f"Site configured: {site.domain}")

    # 2. Configure SocialApp
    client_id = "307624337498-s17dqjagub569k7gmkgl0ofqqdr4rrf5.apps.googleusercontent.com"
    # Note: For verification of access_token, secret might not be strictly required by Google's tokeninfo endpoint 
    # but Allauth model requires it. We'll use a placeholder if we don't have it, 
    # but if authentication fails later we might need the real one. 
    # However, standard implicit flow verification often just needs Client ID.
    secret = "dummy_secret" 

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
        app.save()
        print("Updated existing Google SocialApp")
    else:
        print("Created new Google SocialApp")

    app.sites.add(site)
    print("Linked SocialApp to Site")

if __name__ == '__main__':
    setup_google_auth()
