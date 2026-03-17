import requests
from django.core.mail.backends.base import BaseEmailBackend
from django.conf import settings

class PlunkEmailBackend(BaseEmailBackend):
    """
    A Django Email backend that uses the Plunk REST API.
    """
    def send_messages(self, email_messages):
        if not email_messages:
            return 0
            
        api_key = getattr(settings, 'PLUNK_API_KEY', None)
        if not api_key:
            if not self.fail_silently:
                raise ValueError("PLUNK_API_KEY must be set in settings to use the PlunkEmailBackend")
            return 0
            
        url = "https://api.useplunk.com/v1/send"
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
        num_sent = 0
        for message in email_messages:
            # Extract HTML body if it's an EmailMultiAlternatives
            body = message.body
            if hasattr(message, 'alternatives') and message.alternatives:
                for alt_content, alt_type in message.alternatives:
                    if alt_type == 'text/html':
                        body = alt_content
                        break
            
            # Message.to is a list, but Plunk's basic send accepts a single string or an array of strings in /v1/send
            # According to Plunk docs, 'to' is usually a single email or list
            recipients = message.to
            
            payload = {
                "to": recipients[0] if len(recipients) == 1 else recipients,
                "subject": message.subject,
                "body": body,
            }
            
            if message.from_email:
                # Plunk does not always allow arbitrary from_email unless verified in standard plan,
                # but we will send it if they support setting a reply-to or from.
                # Currently basic Plunk relies on default workspace sender if omitted.
                pass

            try:
                response = requests.post(url, json=payload, headers=headers)
                response.raise_for_status()
                num_sent += 1
            except Exception as e:
                print(f"Plunk Email Error: {e}, Response: {getattr(e, 'response', None)}")
                if not self.fail_silently:
                    raise e
                    
        return num_sent
