import uuid
from datetime import date
from decimal import Decimal

from categories.api.serializers import CategorySerializer
from categories.models import Category
from django.contrib.auth import get_user_model
from django.db.models import Sum
from expenses.models import Expense
from parameterized import parameterized
from periods.api.serializers import PeriodExpenseSerializer, PeriodSerializer
from periods.models import Period
from rest_framework.test import APITestCase

User = get_user_model()


class PeriodSerializerTestMixin:
    def setUp(self) -> None:
        self.user = User.objects.create_user(
            name='Test User',
            email='test@test.com',
            cpf='33887670094',
            date_of_birth='2000-01-01',
            phone_number='33887670094',
            income=Decimal('5000.00'),
            password='testpassword123',
        )

    def make_expenses(self, user, quantity=5, month=date.today()):
        expenses = []
        period = Period.objects.get_or_create(user=user, month=month)[0]
        for i in range(quantity):
            expense = Expense.objects.create(
                name=f'Expense Name {i}',
                description=f'This is a test expense description {i}.',
                value=Decimal('100.00') + Decimal(i),
                date=month,
                status=Expense.STATUS_CHOICES[0][0],
                user=user,
                period=period)
            expense.categories.set(self.make_categories(self.user, 1))
            expenses.append(expense)
        return expenses

    def make_categories(self, user, quantity=5):
        categories = []
        for i in range(quantity):
            categories.append(
                Category.objects.create(
                    name=f'Test Category {i} - {uuid.uuid4()}',
                    description=f'This is a test category {i}.',
                    user=user
                )
            )
        return categories

    def sum_expenses(self, expenses, start_date, end_date):
        total = 0
        for expense in expenses:
            if start_date <= expense.date <= end_date:
                total += expense.value
        return total


class PeriodSerializerTest(PeriodSerializerTestMixin, APITestCase):

    def test_period_serializer_fields_is_correct_value(self):
        period = Period.objects.get_or_create(user=self.user)[0]
        expenses = self.make_expenses(
            user=self.user, month=period.month, quantity=10)
        monthly_expense = period.expenses.aggregate(
            total=Sum('value'))['total'] or 0.0
        balance = self.user.income - monthly_expense
        serializer = PeriodSerializer(period)
        self.assertEqual({e['id'] for e in serializer.data['expenses']},
                         {str(expense.id) for expense in expenses})
        self.assertEqual(str(serializer.data['user_balance']),
                         str(self.user.income))
        self.assertEqual(
            serializer.data['monthly_expense'], monthly_expense)
        self.assertEqual(str(serializer.data['month']), str(period.month))
        self.assertEqual(serializer.data['balance'], balance)


class PeriodExpenseSerializerTest(PeriodSerializerTestMixin, APITestCase):

    def test_period_expense_serializer_fields_is_correct_value(self):
        period = Period.objects.get_or_create(user=self.user)[0]
        expenses = self.make_expenses(
            user=self.user, month=period.month, quantity=10)
        monthly_expense = period.expenses.aggregate(
            total=Sum('value'))['total'] or 0.0
        daily_average = monthly_expense / date.today().day
        category_that_appears_most = self.make_categories(self.user, 1)[0]
        for expense in expenses:
            expense.categories.add(category_that_appears_most)

        serializer = PeriodExpenseSerializer(period)
        self.assertEqual(serializer.data['category_that_appears_most'],
                         CategorySerializer(instance=category_that_appears_most).data)
        self.assertEqual(serializer.data['daily_average'],
                         daily_average)

    @parameterized.expand([
        (
            date(2025, 2, 25),
            {
                'start_date': date(2025, 2, 26),
                'end_date': date(2025, 2, 28),
            }
        ),
        (
            date(2024, 2, 25),
            {
                'start_date': date(2024, 2, 26),
                'end_date': date(2024, 2, 29),
            }
        ),
        (
            date(2025, 6, 25),
            {
                'start_date': date(2025, 6, 26),
                'end_date': date(2025, 6, 30),
            }
        ),
        (
            date(2025, 7, 25),
            {
                'start_date': date(2025, 7, 26),
                'end_date': date(2025, 7, 31),
            }
        )
    ])
    def test_period_expense_serializer_daily_evolution_is_correct_value(
            self, month_date, expected_daily_evolution_in_the_last_days):
        expenses = []
        for i in range(1, 28):
            expenses.append(
                self.make_expenses(
                    user=self.user,
                    month=date(month_date.year, month_date.month, i),
                    quantity=1
                )[0]
            )
        expected_daily_evolution_in_the_last_days['total_expense'] = (
            self.sum_expenses(
                expenses,
                expected_daily_evolution_in_the_last_days['start_date'],
                expected_daily_evolution_in_the_last_days['end_date'])
        )

        daily_evolution = []
        for i in range(1, 22, 5):
            daily_evolution.append(
                {
                    'start_date': date(month_date.year, month_date.month, i),
                    'end_date': date(month_date.year, month_date.month, i + 4),
                    'total_expense': self.sum_expenses(
                        expenses, date(month_date.year, month_date.month, i),
                        date(month_date.year, month_date.month, i + 4))
                }
            )
        daily_evolution.append(expected_daily_evolution_in_the_last_days)
        period = Period.objects.get_or_create(
            user=self.user, month=month_date)[0]
        serializer = PeriodExpenseSerializer(period)
        for i, daily_evolution_item in enumerate(daily_evolution):
            self.assertEqual(
                serializer.data['daily_evolution'][i]['start_date'],
                daily_evolution_item['start_date'])
            self.assertEqual(
                serializer.data['daily_evolution'][i]['end_date'],
                daily_evolution_item['end_date'])
            self.assertEqual(
                serializer.data['daily_evolution'][i]['total_expense'],
                daily_evolution_item['total_expense'])
