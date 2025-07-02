FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY ./requirements/ .

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    netcat-traditional && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r production.txt

COPY . .
RUN chmod +x entrypoint.sh


WORKDIR /app/core

COPY ../entrypoint.sh .

RUN chmod +x ../entrypoint.sh

ENTRYPOINT ["../entrypoint.sh"]

EXPOSE 8000
