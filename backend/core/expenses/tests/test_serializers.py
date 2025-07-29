from datetime import date
from decimal import Decimal

from categories.models import Category
from django.contrib.auth import get_user_model
from expenses.api.serializers import (ExpenseCreateUpdateSerializer,
                                      ExpenseSerializer)
from expenses.models import Expense
from parameterized import parameterized
from rest_framework.serializers import ValidationError
from rest_framework.test import APITestCase

User = get_user_model()


class ExpenseSerializerTest(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            name='Test User',
            email='test@test.com',
            cpf='33887670094',
            date_of_birth='2000-01-01',
            phone_number='33887670094',
            income=Decimal('5000.00'),
            password='testpassword123',
        )

        self.expense_serializer_context = {'user': self.user}
        self.expense_data = {
            'name': 'Expense Name',
            'description': 'This is a test expense description.',
            'value': Decimal('100.00'),
            'date': date.today(),
            'status': Expense.STATUS_CHOICES[0][0],
        }

    def make_categories(self, user, quantity=5):
        categories = []
        for i in range(quantity):
            categories.append(
                Category.objects.create(
                    name=f'Test Category {i}',
                    description=f'This is a test category {i}.',
                    user=user
                )
            )
        return categories

    def test_expense_create_update_serializer_data_is_valid(self):
        self.expense_data['categories'] = [
            c.id for c in self.make_categories(self.user, 1)]
        serializer = ExpenseCreateUpdateSerializer(data=self.expense_data)
        self.assertTrue(serializer.is_valid())

    def test_expense_create_serializer_create_data_is_correct(self):
        self.expense_data['categories'] = [
            c.id for c in self.make_categories(self.user, 1)]
        serializer = ExpenseCreateUpdateSerializer(
            data=self.expense_data, context=self.expense_serializer_context)
        serializer.is_valid(raise_exception=True)
        expense = serializer.save()
        categories_expense_ids = {c.id for c in expense.categories.all()}
        self.assertEqual(expense.name, self.expense_data['name'])
        self.assertEqual(expense.description, self.expense_data['description'])
        self.assertEqual(expense.value, self.expense_data['value'])
        self.assertEqual(expense.date, self.expense_data['date'])
        self.assertEqual(expense.status, self.expense_data['status'])
        self.assertEqual(categories_expense_ids, set(
            self.expense_data['categories']))
        self.assertEqual(expense.user, self.user)

    def test_expense_create_serializer_create_expense_is_success(self):
        self.expense_data['categories'] = [
            c.id for c in self.make_categories(self.user, 1)]
        serializer = ExpenseCreateUpdateSerializer(
            data=self.expense_data, context=self.expense_serializer_context)
        serializer.is_valid(raise_exception=True)
        expense = serializer.save()
        self.assertIsNotNone(expense)

    def test_expense_serializer_update_is_successful(self):
        serializer = ExpenseCreateUpdateSerializer(
            data=self.expense_data, context=self.expense_serializer_context)
        serializer.is_valid(raise_exception=True)
        expense = serializer.save()
        self.assertIsNotNone(expense)
        categories_for_update = self.make_categories(self.user, 2)
        updated_data = {
            'name': 'Expense Updated Name',
            'description': 'This is a test expense updated description.',
            'value': Decimal('500.00'),
            'date': date(year=2023, month=1, day=1),
            'status': Expense.STATUS_CHOICES[1][0],
            'categories': [c.id for c in categories_for_update],
        }
        serializer = ExpenseCreateUpdateSerializer(
            instance=expense, data=updated_data)
        serializer.is_valid(raise_exception=True)
        updated_expense = serializer.save()
        self.assertEqual(updated_expense.name, updated_data['name'])
        self.assertEqual(updated_expense.description,
                         updated_data['description'])
        self.assertEqual(updated_expense.value, updated_data['value'])
        self.assertEqual(updated_expense.date, updated_data['date'])
        self.assertEqual(updated_expense.status, updated_data['status'])
        self.assertEqual(set(updated_expense.categories.all()),
                         set(categories_for_update))

    @parameterized.expand([
        ('name', 'Expense Updated Name'),
        ('description', 'This is a test expense updated description.'),
        ('value', Decimal('500.00')),
        ('date', date(year=2023, month=1, day=1)),
        ('status', Expense.STATUS_CHOICES[1][0]),
        ('categories', 1),
        ('categories', 2),
    ])
    def test_expense_serializer_partial_update_is_successful(self, field,
                                                             value):
        if field == 'categories':
            categories = self.make_categories(self.user, value)
            value = [c.id for c in categories]
        serializer = ExpenseCreateUpdateSerializer(
            data=self.expense_data, context=self.expense_serializer_context)
        serializer.is_valid(raise_exception=True)
        expense = serializer.save()
        serializer = ExpenseCreateUpdateSerializer(
            instance=expense, data={field: value}, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_expense = serializer.save()
        if field == 'categories':
            self.assertEqual(set(updated_expense.categories.all()),
                             set(categories))
        else:
            self.assertEqual(str(getattr(updated_expense, field)), str(value))

    def test_expense_serializer_delete_raises_does_not_exist_error(self):
        serializer = ExpenseCreateUpdateSerializer(
            data=self.expense_data, context=self.expense_serializer_context)
        serializer.is_valid(raise_exception=True)
        expense = serializer.save()
        serializer = ExpenseSerializer(instance=expense)
        expense.delete()
        with self.assertRaises(Category.DoesNotExist):
            Category.objects.get(id=expense.id)

    def test_expense_serializer_create_without_user_fails(self):
        self.expense_data['categories'] = [
            c.id for c in self.make_categories(self.user, 1)]
        serializer = ExpenseCreateUpdateSerializer(data=self.expense_data)
        with self.assertRaises(ValueError):
            serializer.is_valid(raise_exception=True)
            serializer.save()

    @parameterized.expand([
        ('name', '43985849060554360496456'),
        ('name', '][[´[´]]$#$#¨*¨((##@)'),
        ('description', '[]@##&%¨&%¨*#@@¨'),
        ('value', '50000000000000000000000.00'),
        ('value', ''),
        ('value', '500,00'),
        ('value', '500.000'),
        ('date', '2022,01,01'),
        ('date', '2022,01,01'),
        ('date', ''),
        ('date', '2022/01/01'),
        ('status', ''),
        ('status', 'rjgoeigjoer'),
        ('status', '654644654'),
        ('categories', ''),
        ('categories', '550e8400-e29b-41d4-a716-446655440001'),
        ('categories', ['550e8400-e29b-41d4-a716-446655440001']),
    ])
    def test_expense_serializer_is_invalid_field_value(self, field, value):
        serializer = ExpenseCreateUpdateSerializer(
            data=self.expense_data, context=self.expense_serializer_context)
        serializer.is_valid(raise_exception=True)
        expense = serializer.save()
        serializer = ExpenseCreateUpdateSerializer(
            instance=expense, data={field: value}, partial=True)
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)
