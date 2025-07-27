from calendar import monthrange
from datetime import date

from categories.api.serializers import CategorySerializer
from categories.models import Category
from django.db.models import Count, Sum
from django.template.defaultfilters import date as date_filter
from drf_spectacular.utils import (OpenApiExample, extend_schema_field,
                                   extend_schema_serializer)
from expenses.api.serializers import ExpenseSerializer
from periods.models import Period
from rest_framework import serializers


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Period Example',
            value={
                'id': '550e8400-e29b-41d4-a716-446655440000',
                'expenses': [
                    {
                        'id': '550e8400-e29b-41d4-a716-446655440001',
                        'name': 'Grocery Shopping',
                        'value': '150.50',
                        'categories': [
                            {
                                'id': '550e8400-e29b-41d4-a716-446655440002',
                                'name': 'Food',
                                'description': 'Expenses related to food'
                            }
                        ],
                        'date': '2024-01-15',
                        'description': 'Weekly groceries',
                        'status': 'AP'
                    }
                ],
                'monthly_expense': 150.50,
                'balance': 849.50,
                'month': '2024-01-01',
                'user_balance': 1000.00
            },
            description='Example of a complete period with expenses and '
                        'balance'
        )
    ]
)
class PeriodSerializer(serializers.ModelSerializer):
    """
    Serializer for the Period model.

    Provides complete period data including expenses, monthly totals,
    and balance calculations.
    """

    expenses = ExpenseSerializer(many=True, read_only=True)
    monthly_expense = serializers.SerializerMethodField()
    balance = serializers.SerializerMethodField()
    user_balance = serializers.SerializerMethodField()

    class Meta:
        model = Period
        fields = ('id', 'expenses', 'monthly_expense',
                  'balance', 'month', 'user_balance')
        extra_kwargs = {
            'id': {
                'read_only': True,
                'help_text': 'Unique period ID (auto-generated)'
            },
            'expenses': {
                'help_text': 'List of expenses for this period'
            },
            'monthly_expense': {
                'help_text': 'Total expenses for the month'
            },
            'balance': {
                'help_text': 'Remaining balance after expenses'
            },
            'month': {
                'help_text': 'Period month (YYYY-MM-01 format)'
            },
            'user_balance': {
                'help_text': 'User\'s total balance'
            }
        }

    @extend_schema_field(float)
    def get_user_balance(self, obj):
        """
        Returns the user's balance as a float.

        Args:
            obj: Period instance

        Returns:
            float: User's balance
        """
        return float(obj.user_balance)

    @extend_schema_field(float)
    def get_monthly_expense(self, obj):
        """
        Calculates the total monthly expenses.

        Args:
            obj: Period instance

        Returns:
            float: Total monthly expenses
        """
        monthly_expense = obj.expenses.aggregate(
            total=Sum('value'))['total'] or 0.0
        return float(monthly_expense)

    @extend_schema_field(float)
    def get_balance(self, obj):
        """
        Calculates the remaining balance after expenses.

        Args:
            obj: Period instance

        Returns:
            float: Remaining balance
        """
        return float(obj.user_balance) - float(self.get_monthly_expense(obj))


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Period Month',
            value={
                'user_balance': 1000.00,
                'monthly_expense': 150.50
            },
            description='Example of period month data'
        )
    ]
)
class PeriodMonthSerializer(PeriodSerializer):
    """
    Simplified serializer for period month data.

    Contains only balance and monthly expense information.
    """

    class Meta(PeriodSerializer.Meta):
        fields = ('user_balance', 'monthly_expense')


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Financial Evolution',
            value={
                'financial_evolution': [
                    {
                        'month_abbreviation': 'Oct',
                        'data': {
                            'user_balance': 1000.00,
                            'monthly_expense': 120.00
                        },
                        'date': '2023-10-01'
                    },
                    {
                        'month_abbreviation': 'Nov',
                        'data': {
                            'user_balance': 1000.00,
                            'monthly_expense': 150.00
                        },
                        'date': '2023-11-01'
                    }
                ]
            },
            description='Example of financial evolution data'
        )
    ]
)
class PeriodFinancialEvolutionSerializer(PeriodSerializer):
    """
    Serializer for financial evolution analysis.

    Provides financial data for 3 months back and 3 months forward.
    """

    financial_evolution = serializers.SerializerMethodField()

    class Meta(PeriodSerializer.Meta):
        fields = ('financial_evolution',)
        extra_kwargs = {
            'financial_evolution': {
                'help_text': 'Financial evolution data for 7 months (3 back, '
                'current, 3 forward)'
            }
        }

    def _get_financial_evolution(self, current_period, start, stop, step):
        """
        Helper method to calculate financial evolution for a date range.

        Args:
            current_period: Current period instance
            start: Start month offset
            stop: Stop month offset
            step: Step between months

        Returns:
            list: List of financial evolution data
        """
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

    @extend_schema_field({
        'type': 'array',
        'items': {
            'type': 'object',
            'properties': {
                'month_abbreviation': {'type': 'string'},
                'data': {
                    'type': 'object',
                    'properties': {
                        'user_balance': {'type': 'number'},
                        'monthly_expense': {'type': 'number'}
                    }
                },
                'date': {'type': 'string', 'format': 'date'}
            }
        }
    })
    def get_financial_evolution(self, obj):
        """
        Return the financial evolution of 3 months back and 3 months forward
        from the current date, including the dates of each month.

        Args:
            obj: Period instance

        Returns:
            list: Financial evolution data for 7 months
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


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Period Date',
            value={
                'period_date': '2024-01-15'
            },
            description='Example of period date for export'
        )
    ]
)
class PeriodDateSerializer(serializers.Serializer):
    """
    Serializer for period date input.

    Used for period export functionality.
    """

    period_date = serializers.DateField(
        help_text='Date for period export (YYYY-MM-DD format)'
    )


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Period Expense Analysis',
            value={
                'id': '550e8400-e29b-41d4-a716-446655440000',
                'category_that_appears_most': {
                    'id': '550e8400-e29b-41d4-a716-446655440001',
                    'name': 'Food',
                    'description': 'Expenses related to food'
                },
                'daily_average': 5.02,
                'daily_evolution': [
                    {
                        'start_date': '2024-01-01',
                        'end_date': '2024-01-05',
                        'total_expense': 25.10
                    }
                ],
                'month': '2024-01-01',
                'monthly_expense': 150.50
            },
            description='Example of period expense analysis'
        )
    ]
)
class PeriodExpenseSerializer(PeriodSerializer):
    """
    Serializer for detailed period expense analysis.

    Provides category analysis, daily averages, and expense evolution.
    """

    category_that_appears_most = serializers.SerializerMethodField()
    daily_average = serializers.SerializerMethodField()
    daily_evolution = serializers.SerializerMethodField()

    class Meta(PeriodSerializer.Meta):
        fields = ('id', 'category_that_appears_most', 'daily_average',
                  'daily_evolution', 'month', 'monthly_expense', )
        extra_kwargs = {
            'category_that_appears_most': {
                'help_text': 'Category with the most expenses in this period'
            },
            'daily_average': {
                'help_text': 'Average daily expense for the current month'
            },
            'daily_evolution': {
                'help_text': 'Expense evolution by date intervals'
            }
        }

    @extend_schema_field(serializers.DictField)
    def get_category_that_appears_most(self, obj):
        """
        Returns the category that appears most frequently in expenses.

        Args:
            obj: Period instance

        Returns:
            dict: Category data or empty dict if no expenses
        """
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

    @extend_schema_field(float)
    def get_daily_average(self, obj):
        """
        Calculates the daily average expense for the current month.

        Args:
            obj: Period instance

        Returns:
            float: Daily average expense
        """
        return self.get_monthly_expense(obj) / date.today().day

    @extend_schema_field(float)
    def get_total_expense(self, obj, start_date, end_date):
        """
        Calculates total expenses for a date range.

        Args:
            obj: Period instance
            start_date: Start date for calculation
            end_date: End date for calculation

        Returns:
            float: Total expenses for the date range
        """
        return float(obj.expenses.filter(
            date__gte=start_date,
            date__lte=end_date
        ).aggregate(total=Sum('value'))['total'] or 0.0)

    @extend_schema_field({
        'type': 'array',
        'items': {
            'type': 'object',
            'properties': {
                'start_date': {'type': 'string', 'format': 'date'},
                'end_date': {'type': 'string', 'format': 'date'},
                'total_expense': {'type': 'number'}
            }
        }
    })
    def get_daily_evolution(self, obj):
        """
        Calculates expense evolution by date intervals.

        Args:
            obj: Period instance

        Returns:
            list: List of expense intervals with totals
        """
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
