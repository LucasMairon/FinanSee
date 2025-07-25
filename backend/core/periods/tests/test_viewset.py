import uuid
from calendar import monthrange
from datetime import date
from decimal import Decimal

from categories.models import Category
from django.contrib.auth import get_user_model
from django.urls import reverse
from expenses.models import Expense
from parameterized import parameterized
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

    def test_evolution_with_year_is_status_code_200_ok(self):
        self.authenticate(self.user)
        Period.objects.get_or_create(user=self.user, month=date.today())
        response = self.client.get(
            reverse('period-evolution') + f'?year={date.today().year}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_evolution_without_authentication_is_status_code_401_unauthorized(self):
        response = self.client.get(reverse('period-evolution'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_evolution_with_invalid_year_is_status_code_404_not_found(self):
        self.authenticate(self.user)
        Period.objects.get_or_create(user=self.user, month=date(2024, 1, 1))
        response = self.client.get(reverse('period-evolution') + '?year=224')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_evolution_with_year_is_correct_but_period_not_exist_is_status_code_404_not_found(self):
        self.authenticate(self.user)
        response = self.client.get(
            reverse('period-evolution') + f'?year={date.today().year}')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @parameterized.expand([
        (date(2025, 2, 25),),
        (date(2024, 2, 25),),
        (date(2025, 6, 25),),
        (date(2025, 7, 25),),
    ])
    def test_evolution_is_correct_data(self, month_date):
        self.authenticate(self.user)
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
            reverse('period-evolution') + f'?year={month_date.year}')
        self.assertEqual(
            response.data['daily_evolution'], expected_daily_evolution)
