from calendar import monthrange
from datetime import date

from categories.api.serializers import CategorySerializer
from categories.models import Category
from django.db.models import Count, Sum
from expenses.api.serializers import ExpenseSerializer
from periods.models import Period
from rest_framework import serializers


class PeriodSerializer(serializers.ModelSerializer):
    expenses = ExpenseSerializer(many=True, read_only=True)
    monthly_expense = serializers.SerializerMethodField()
    balance = serializers.SerializerMethodField()

    class Meta:
        model = Period
        fields = ('id', 'expenses', 'monthly_expense',
                  'balance', 'user_balance', 'month')

    def get_monthly_expense(self, obj):
        return obj.expenses.aggregate(total=Sum('value'))['total'] or 0.0

    def get_balance(self, obj):
        return float(obj.user_balance) - float(self.get_monthly_expense(obj))


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
