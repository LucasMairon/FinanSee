from .base import *

DEBUG = config('DEBUG', default=False, cast=bool)

CORS_ALLOW_ALL_ORIGINS = config('CORS_ALLOW_ALL_ORIGINS',
                                cast=bool,
                                default=False)

if not CORS_ALLOW_ALL_ORIGINS:
    CORS_ALLOWED_ORIGINS = config(
        'CORS_ALLOWED_ORIGINS',
        cast=lambda v: [s.strip()for s in v.split(',')],
        default=[])

SECRET_KEY = config('SECRET_KEY')

ALLOWED_HOSTS = config('ALLOWED_HOSTS',
                       cast=lambda v: [s.strip() for s in v.split(',')])
