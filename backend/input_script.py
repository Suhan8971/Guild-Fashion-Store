from django.contrib.auth import get_user_model
User = get_user_model()

username_input = "suhankaminofficial@gmail.com"
password_input = "@897155Kavanamin"

print(f"Checking user: {username_input}")

try:
    user = User.objects.filter(username=username_input).first()
    if not user:
        user = User.objects.filter(email=username_input).first()

    if user:
        print(f"User found: {user.username} (email: {user.email})")
        if user.check_password(password_input):
            print("Password MATCHES.")
        else:
            print("Password DOES NOT match.")
            user.set_password(password_input)
            user.save()
            print("Password RESET done.")
    else:
        print("User NOT FOUND.")
        # Create user if not found?
        user = User.objects.create_user(username=username_input, email=username_input, password=password_input, role='admin')
        print(f"User CREATED: {user.username}")

except Exception as e:
    print(f"Error: {e}")
