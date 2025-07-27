import uuid
from calendar import monthrange
from datetime import date
from decimal import Decimal

from categories.models import Category
from django.contrib.auth import get_user_model
from django.urls import reverse
from expenses.models import Expense
from freezegun import freeze_time
from periods.models import Period
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class PeriodSerializerTestCase(APITestCase):

    def setUp(self):
        self.period_url = 'period-list'
        self.period_detail_url = 'period-detail'
        self.period_action_current_period_url = 'period-current-period'
        self.period_action_daily_evolution_url = 'period-daily-evolution'
        self.period_action_financial_evolution_url = 'period-financial-evolution'
        self.user = User.objects.create_user(email='test@test.com',
                                             password='testpassword')
        self.another_user = User.objects.create_user(
            email='another_user@anoter_user.com',
            password='anotherpassword')
        self.expense_data = {
            'name': 'Expense Name',
            'description': 'This is a test expense description.',
            'value': Decimal('100.00'),
            'date': date.today(),
            'status': Expense.STATUS_CHOICES[0][0],
        }

    def sum_expenses(self, expenses, start_date, end_date):
        total = 0.0
        for expense in expenses:
            if expense.date >= start_date and expense.date <= end_date:
                total += float(expense.value)
        return total

    def make_expenses(self, user, quantity=5, month=date.today()):
        expenses = []
        period, _ = Period.objects.get_or_create(
            user=user, month=month)
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

    def authenticate(self, user):
        refresh_token = RefreshToken.for_user(user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {refresh_token.access_token}')

    def test_list_periods_is_status_code_200_ok(self):
        self.authenticate(self.user)
        response = self.client.get(reverse(self.period_url))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_periods_without_authentication_is_status_code_401_unauthorized(self):
        response = self.client.get(reverse(self.period_url))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_periods_created_by_another_user_not_visible(self):
        Period.objects.get_or_create(user=self.user)
        self.authenticate(self.another_user)
        response = self.client.get(reverse(self.period_url))
        self.assertEqual(len(response.data), 0)
        self.authenticate(self.user)
        response = self.client.get(reverse(self.period_url))
        self.assertEqual(len(response.data), 1)

    def test_period_list_returns_expenses(self):
        Period.objects.get_or_create(user=self.user)
        self.authenticate(self.user)
        quantity_periods = 1
        response = self.client.get(reverse(self.period_url))
        self.assertEqual(len(response.data), quantity_periods)

    def test_retrieve_period_is_status_code_200_ok(self):
        self.authenticate(self.user)
        period = Period.objects.get_or_create(user=self.user)[0]
        response = self.client.get(
            reverse(self.period_detail_url, kwargs={'pk': period.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_period_without_authentication_is_status_code_401_unauthorized(self):
        period = Period.objects.get_or_create(user=self.user)[0]
        response = self.client.get(
            reverse(self.period_detail_url, kwargs={'pk': period.id}),)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_non_existent_period_is_status_code_404_not_found(self):
        self.authenticate(self.user)
        response = self.client.get(
            reverse(self.period_detail_url, kwargs={'pk': uuid.uuid4()}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_period_fields_is_expected(self):
        self.authenticate(self.user)
        period = Period.objects.get_or_create(user=self.user)[0]
        expected_fields = {'id', 'expenses', 'monthly_expense',
                           'balance', 'user_balance', 'month'}
        response = self.client.get(
            reverse(self.period_detail_url, kwargs={'pk': period.id}))
        self.assertEqual(set(response.data.keys()), expected_fields)

    def test_retrieve_period_created_by_another_user_is_status_code_404_not_found(self):
        period = Period.objects.get_or_create(user=self.user)[0]
        self.authenticate(self.another_user)
        response = self.client.get(
            reverse(self.period_detail_url, kwargs={'pk': period.id}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_current_period_is_status_code_200_ok(self):
        self.authenticate(self.user)
        response = self.client.get(reverse('period-current-period'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_current_period_is_correct_value(self):
        self.authenticate(self.user)
        response = self.client.get(
            reverse(self.period_action_current_period_url))
        period = Period.objects.get_or_create(
            user=self.user, month=date.today())[0]
        self.assertEqual(response.data['id'], str(period.id))

    def test_daily_evolution_is_status_code_200_ok(self):
        self.authenticate(self.user)
        Period.objects.get_or_create(user=self.user, month=date.today())
        response = self.client.get(
            reverse(self.period_action_daily_evolution_url))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_daily_evolution_without_authentication_is_status_code_401_unauthorized(self):
        response = self.client.get(
            reverse(self.period_action_daily_evolution_url))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_daily_evolution_is_correct_data(self):
        self.authenticate(self.user)
        month_date = date.today()
        last_day = monthrange(month_date.year, month_date.month)[1]
        expenses = []
        for i in range(1, last_day):
            expenses.append(
                self.make_expenses(
                    user=self.user,
                    month=date(month_date.year, month_date.month, i),
                    quantity=1
                )[0]
            )
        end_day = 22
        step = 5
        displacement = 4
        expected_daily_evolution_in_the_last_days = {
            'start_date': date(
                month_date.year, month_date.month, end_day + displacement),
            'end_date': date(month_date.year, month_date.month, last_day),
            'total_expense': self.sum_expenses(
                expenses,
                date(month_date.year,
                     month_date.month, end_day + displacement),
                date(month_date.year, month_date.month, last_day))
        }
        expected_daily_evolution = []
        for i in range(1, end_day, step):
            expected_daily_evolution.append(
                {
                    'start_date': date(month_date.year, month_date.month, i),
                    'end_date': date(
                        month_date.year, month_date.month, i + displacement),
                    'total_expense': self.sum_expenses(
                        expenses,
                        date(month_date.year, month_date.month, i),
                        date(month_date.year,
                             month_date.month, i + displacement))
                }
            )
        expected_daily_evolution.append(
            expected_daily_evolution_in_the_last_days)
        response = self.client.get(
            reverse(self.period_action_daily_evolution_url))
        self.assertEqual(
            response.data['daily_evolution'], expected_daily_evolution)

    def test_financial_evolution_is_status_code_200_ok(self):
        self.authenticate(self.user)
        response = self.client.get(
            reverse(self.period_action_financial_evolution_url))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_financial_evolution_without_authentication_is_status_code_401_unauthorized(self):
        response = self.client.get(
            reverse(self.period_action_financial_evolution_url))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @freeze_time('2025-07-01')
    def test_financial_evolution_is_correct_data(self):
        self.authenticate(self.user)
        current_period, _ = Period.objects.get_or_create(user=self.user)
        expected_months = ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out']
        for i in range(1, 13):
            self.make_expenses(
                user=self.user,
                month=date(current_period.month.year, i, 1),
                quantity=i)
        response = self.client.get(
            reverse(self.period_action_financial_evolution_url))
        actual_evolution = response.data['financial_evolution']
        actual_months = [item['month_abbreviation']
                         for item in actual_evolution]
        self.assertEqual(actual_months, expected_months)
        for item in actual_evolution:
            self.assertIn(item['date'].year, [current_period.month.year - 1,
                                              current_period.month.year,
                                              current_period.month.year + 1])
