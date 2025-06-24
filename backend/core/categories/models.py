import uuid
from django.db import models
from django.contrib.auth import get_user_model

from categories.validators import name_regex_validator

User = get_user_model()


class Category(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )
    name = models.CharField(max_length=255, validators=[name_regex_validator])
    description = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.name)
