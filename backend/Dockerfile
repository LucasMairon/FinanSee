FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY ./requirements/ .

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    netcat-traditional \
    libpango-1.0-0 \
    libharfbuzz0b \
    libgdk-pixbuf-2.0-0 \
    libpangoft2-1.0-0 && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r production.txt

COPY . .
RUN chmod +x entrypoint.sh


WORKDIR /app/core

COPY ../entrypoint.sh .

RUN chmod +x ../entrypoint.sh

ENTRYPOINT ["../entrypoint.sh"]
