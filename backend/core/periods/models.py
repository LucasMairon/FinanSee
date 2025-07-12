import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import UniqueConstraint
from django.db.models.functions import ExtractMonth, ExtractYear
from django.db.models import F

from decimal import Decimal

from .managers import PeriodManager

User = get_user_model()


class Period(models.Model):
    id = models.UUIDField(
        default=uuid.uuid4,
        primary_key=True,
        editable=False,
        unique=True,
    )
    user = models.ForeignKey(
        to=User,
        on_delete=models.CASCADE,
        related_name='periods',
    )
    month = models.DateField(null=True)
    user_balance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
    )

    objects = PeriodManager()

    class Meta:
        verbose_name = 'Period'
        verbose_name_plural = 'Periods'
        ordering = ['-month']
        constraints = [
            UniqueConstraint(
                F('user'),
                ExtractMonth('month'),
                ExtractYear('month'),
                name='unique_month_year_per_user',
            ),
        ]
