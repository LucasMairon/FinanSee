#!/usr/bin/env bash

echo "Migrando banco de dados..."
pip install -r ./backend/requirements/production.txt

echo "Migrando banco de dados..."
python3 manage.py makemigrations --noinput
python3 manage.py migrate --noinput

echo "Coletando arquivos estáticos..."
python3 manage.py collectstatic --noinput
