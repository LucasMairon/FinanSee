from datetime import date

from django.contrib.auth import get_user_model
from django.db.models.signals import post_save

from periods.models import Period

User = get_user_model()


def update_user_balance(sender, instance, created, **kwargs):
    date_today = date.today()
    if not created:
        period = Period.objects.filter(
            user=instance,
            month__month=date_today.month,
            month__year=date_today.year
        )
        period.update(balance=instance.income)
        period.save()


post_save.connect(update_user_balance, sender=User)
