from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Debug user login and reset password'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        username_input = "suhankaminofficial@gmail.com"
        password_input = "@897155Kavanamin"

        self.stdout.write(f"Checking user: {username_input}")

        user = User.objects.filter(username=username_input).first()
        if not user:
            self.stdout.write("User not found by username. Checking email...")
            user = User.objects.filter(email=username_input).first()

        if user:
            self.stdout.write(f"User FOUND: {user.username} (ID: {user.id}, Email: {user.email})")
            if user.check_password(password_input):
                 self.stdout.write(self.style.SUCCESS("Password MATCHES."))
            else:
                 self.stdout.write(self.style.WARNING("Password DOES NOT match."))
                 user.set_password(password_input)
                 user.save()
                 self.stdout.write(self.style.SUCCESS("Password has been RESET to the provided one."))
        else:
             self.stdout.write(self.style.ERROR("User NOT FOUND."))
             # Optional: Create user
             user = User.objects.create_user(username=username_input, email=username_input, password=password_input, role='admin')
             self.stdout.write(self.style.SUCCESS(f"User CREATED: {user.username}"))
