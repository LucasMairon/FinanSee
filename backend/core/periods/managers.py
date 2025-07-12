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

    def get_period_by_date(self, user, date):
        """
        Get the period for a specific date
        """

        period = self.get_queryset().filter(
            user=user,
            month__year=date.year,
            month__month=date.month
        )

        return period.first() if period.exists() else None

    def create_period_by_date(self, user, month):
        """
        Create period on a specific date
        """
        return self.create(
            user=user,
            month=month,
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

        month = kwargs.get('month')
        if month:
            period = self.get_period_by_date(user, month)
            if not period:
                return self.create_period_by_date(user, month), True
            return period, False

        period = self.get_current_period(user)
        if not period:
            period = self.create_current_period(user)
            return period, True
        return period, False
