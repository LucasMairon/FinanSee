import uuid
from datetime import date
from decimal import Decimal

from categories.models import Category
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.db import models
from expenses.validators import (
    description_with_space_and_numbers_regex_validator, name_regex_validator)
from periods.models import Period

User = get_user_model()


class Expense(models.Model):
    STATUS_CHOICES = (
        ('AP', 'A Pagar'),
        ('P', 'Paga'),
    )
    id = models.UUIDField(
        primary_key=True,
        editable=False,
        unique=True,
        default=uuid.uuid4,
    )
    user = models.ForeignKey(
        User,
        related_name='expenses',
        on_delete=models.CASCADE
    )
    categories = models.ManyToManyField(
        Category,
        related_name='expenses',
        blank=True
    )
    period = models.ForeignKey(
        Period,
        related_name='expenses',
        on_delete=models.CASCADE
    )
    name = models.CharField(
        max_length=255,
        validators=[name_regex_validator]
    )
    value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[
            MinValueValidator(Decimal('0.00')),
        ]
    )
    date = models.DateField(default=date.today, null=True)
    description = models.TextField(
        blank=True, null=True,
        validators=[description_with_space_and_numbers_regex_validator],
    )
    status = models.CharField(max_length=2, choices=STATUS_CHOICES)

    class Meta:
        ordering = ['-date']
        verbose_name = 'Expense'
        verbose_name_plural = 'Expenses'

    def __str__(self):
        return str(self.name)
