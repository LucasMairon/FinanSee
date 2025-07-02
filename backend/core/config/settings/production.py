from .base import *


DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=lambda v: [
                       s.strip() for s in v.split(',')])

SECRET_KEY = config('SECRET_KEY', cast=lambda v: [
                    s.strip() for s in v.split(',')])
