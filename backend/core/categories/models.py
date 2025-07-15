import uuid

from categories.validators import name_regex_validator
from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Category(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )
    name = models.CharField(
        unique=True,
        max_length=255,
        validators=[name_regex_validator])
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['name']
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return str(self.name)
