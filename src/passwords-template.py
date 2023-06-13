from pathlib import Path
import os
BASE_DIR = Path(__file__).resolve().parent


DJANGO_SECRET_KEY = 'PUT YOUR SECRET KEY HERE!'
CHATGPT_API_KEY = 'PUT YOUR CHATGPT API KEY HERE!'

ALLOWED_HOSTNAMES = ['*']

DATABASE_ENGINE = 'django.db.backends.sqlite3'
DATABASE_PASSWORD = 'wordlelab'
DATABASE_USER = 'wordlelab'
DATABASE_NAME = os.path.join(BASE_DIR, 'wordlelab.sqlite3')

DEBUG = True
