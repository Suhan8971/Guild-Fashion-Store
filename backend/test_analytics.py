import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings') # Adjust setting path if needed
django.setup()

from store.views import AnalyticsView
from django.test import RequestFactory
import traceback

try:
    factory = RequestFactory()
    request = factory.get('/api/analytics/?range=today')
    view = AnalyticsView()
    response = view.get(request)
    print("SUCCESS")
except Exception as e:
    traceback.print_exc()
