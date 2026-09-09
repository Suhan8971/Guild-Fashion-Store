from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        # If the social account is already linked to a user, do nothing
        if sociallogin.is_existing:
            return
        
        # Check if email exists
        email = sociallogin.user.email
        if not email:
            return
            
        try:
            # Check if an existing local account has the same email address
            user = User.objects.get(email=email)
            # Automatically connect the social login to the existing user account
            sociallogin.connect(request, user)
            print(f"Automatically linked Google account for: {email}")
        except User.DoesNotExist:
            pass
