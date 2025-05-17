import os

if os.environ.get('DJANGO_SETTINGS_MODULE') == 'config.settings.development':
    from config.settings.development import *
elif os.environ.get('DJANGO_SETTINGS_MODULE') == 'config.settings.production':
    from config.settings.production import *
