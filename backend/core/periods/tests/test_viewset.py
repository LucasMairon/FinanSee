import uuid
from datetime import date
from decimal import Decimal

from categories.models import Category
from django.contrib.auth import get_user_model
from django.urls import reverse
from expenses.models import Expense
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

    def make_expenses(self, user, quantity=5, month=date.today()):
        expenses = []
        period = Period.objects.create(
            user=user, month=month, user_balance=user.income)
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
        expected_fields = {'id', 'expenses', 'gasto_mensal',
                           'saldo', 'user_balance'}
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
