import uuid
from datetime import date
from decimal import Decimal

from categories.models import Category
from django.contrib.auth import get_user_model
from expenses.models import Expense
from periods.api.serializers import PeriodSerializer
from periods.models import Period
from rest_framework.test import APITestCase

User = get_user_model()


class PeriodSerializerTest(APITestCase):
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

    def test_period_serializer_fields_is_correct_value(self):
        period = Period.objects.get_or_create(user=self.user)[0]
        expenses = self.make_expenses(
            user=self.user, month=period.month, quantity=10)
        serializer = PeriodSerializer(period)
        self.assertEqual({e['id'] for e in serializer.data['expenses']},
                         {str(expense.id) for expense in expenses})
        self.assertEqual(serializer.data['gasto_mensal'],
                         sum(expense.value for expense in expenses))
        self.assertEqual(
            serializer.data['saldo'],
            self.user.income - sum(expense.value for expense in expenses))
        self.assertEqual(serializer.data['user_balance'],
                         str(self.user.income))
