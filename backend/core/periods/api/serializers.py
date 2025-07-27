from calendar import monthrange
from datetime import date

from categories.api.serializers import CategorySerializer
from categories.models import Category
from django.db.models import Count, Sum
from django.template.defaultfilters import date as date_filter
from expenses.api.serializers import ExpenseSerializer
from periods.models import Period
from rest_framework import serializers


class PeriodSerializer(serializers.ModelSerializer):
    expenses = ExpenseSerializer(many=True, read_only=True)
    monthly_expense = serializers.SerializerMethodField()
    balance = serializers.SerializerMethodField()
    user_balance = serializers.SerializerMethodField()

    class Meta:
        model = Period
        fields = ('id', 'expenses', 'monthly_expense',
                  'balance', 'month', 'user_balance')

    def get_user_balance(self, obj):
        return float(obj.user_balance)

    def get_monthly_expense(self, obj):
        monthly_expense = obj.expenses.aggregate(
            total=Sum('value'))['total'] or 0.0
        return float(monthly_expense)

    def get_balance(self, obj):
        return float(obj.user_balance) - float(self.get_monthly_expense(obj))


class PeriodMonthSerializer(PeriodSerializer):
    class Meta(PeriodSerializer.Meta):
        fields = ('user_balance', 'monthly_expense')


class PeriodFinancialEvolutionSerializer(PeriodSerializer):
    financial_evolution = serializers.SerializerMethodField()

    class Meta(PeriodSerializer.Meta):
        fields = ('financial_evolution',)

    def _get_financial_evolution(self, current_period, start, stop, step):
        expected_financial_evolution = []
        current_date = current_period.month
        for i in range(start, stop, step):
            target_month = current_date.month + (i * step)
            target_year = current_date.year
            if target_month > 12:
                target_month -= 12
                target_year += 1
            elif target_month < 1:
                target_month += 12
                target_year -= 1
            target_date = date(target_year, target_month, 1)
            period = Period.objects.get_period_by_date(
                user=current_period.user,
                date=target_date
            )
            expected_financial_evolution.append({
                'month_abbreviation': date_filter(target_date, 'M'),
                'data': PeriodMonthSerializer(period).data,
                'date': target_date
            })
        return expected_financial_evolution

    def get_financial_evolution(self, obj):
        """
        Return the financial evolution of 3 months back and 3 months forward
        from the current date, including the dates of each month.
        """
        month_displacement = 3
        evolution = self._get_financial_evolution(
            current_period=obj,
            start=month_displacement,
            stop=0,
            step=-1)
        evolution.append({
            'month_abbreviation': date_filter(obj.month, 'M'),
            'data': PeriodMonthSerializer(obj).data,
            'date': obj.month
        })
        evolution += self._get_financial_evolution(
            current_period=obj,
            start=1,
            stop=month_displacement + 1,
            step=1)
        return evolution


class PeriodDateSerializer(serializers.Serializer):
    period_date = serializers.DateField()


class PeriodExpenseSerializer(PeriodSerializer):
    category_that_appears_most = serializers.SerializerMethodField()
    daily_average = serializers.SerializerMethodField()
    daily_evolution = serializers.SerializerMethodField()

    class Meta(PeriodSerializer.Meta):
        fields = ('id', 'category_that_appears_most', 'daily_average',
                  'daily_evolution', 'month', 'monthly_expense', )

    def get_category_that_appears_most(self, obj):
        category_data = (
            obj.expenses.values('categories')
            .annotate(count=Count('categories'))
            .order_by('-count')
            .first()
        )
        if not category_data or not category_data['categories']:
            return {}
        category = Category.objects.get(id=category_data['categories'])
        return CategorySerializer(instance=category).data

    def get_daily_average(self, obj):
        return self.get_monthly_expense(obj) / date.today().day

    def get_total_expense(self, obj, start_date, end_date):
        return obj.expenses.filter(
            date__gte=start_date,
            date__lte=end_date
        ).aggregate(total=Sum('value'))['total'] or 0.0

    def get_daily_evolution(self, obj):
        year = obj.month.year
        month = obj.month.month
        last_day = monthrange(year, month)[1]
        intervals = []
        step = 5
        displacement = 4
        start_day = 1
        end_day = 22

        for i in range(start_day, end_day, step):
            intervals.append({
                'start_date': date(year, month, i),
                'end_date': date(year, month, i + displacement),
                'total_expense': self.get_total_expense(
                    obj, date(year, month, i),
                    date(year, month, i + displacement))
            })
        end_day += displacement
        intervals.append({
            'start_date': date(year, month, end_day),
            'end_date': date(year, month, last_day),
            'total_expense': self.get_total_expense(
                obj, date(year, month, end_day), date(year, month, last_day))
        })
        return intervals
