from .base import *


DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS')

SECRET_KEY = config('SECRET_KEY')
