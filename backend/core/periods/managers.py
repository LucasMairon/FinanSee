from datetime import date

from django.db.models import Manager


def get_today_date():
    """ Returns today's date. """
    return date.today()


class PeriodManager(Manager):

    def get_current_period(self, user):
        """
        Returns the current period for the user based on today's date.
        If no period exists for the current month, returns None.
        """
        today = get_today_date()
        return self.filter(
            user=user,
            month__year=today.year,
            month__month=today.month
        ).first()

    def create_current_period(self, user):
        """
        Creates a new period for the user for the current month.
        """
        today = get_today_date()
        return self.create(
            user=user,
            month=today,
            user_balance=user.income
        )

    def get_or_create(self, defaults=..., **kwargs):
        """
        Gets or creates the current period for the user.
        If a period for the current month exists, returns it and False.
        If it does not exist, creates a new period and returns it with True.
        """
        user = kwargs.get('user')
        if not user:
            raise ValueError(
                "User must be provided to get or create a period.")
        period = self.get_current_period(user)
        if not period:
            period = self.create_current_period(user)
            return period, True
        return period, False
