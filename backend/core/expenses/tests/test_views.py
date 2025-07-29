import uuid
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


class ExpenseViewSetTestCase(APITestCase):

    def setUp(self):
        self.expense_url = 'expense-list'
        self.expense_detail_url = 'expense-detail'
        self.expense_action_add_category_url = 'expense-add-category'
        self.expense_action_remove_category_url = 'expense-remove-category'
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

    def test_list_expenses_is_status_code_200_ok(self):
        self.authenticate(self.user)
        response = self.client.get(reverse(self.expense_url))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_expenses_without_authentication_is_status_code_401_unauthorized(self):
        response = self.client.get(reverse(self.expense_url))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_espenses_created_by_another_user_not_visible(self):
        quantity_expenses = 5
        self.make_expenses(self.user, quantity_expenses)
        self.authenticate(self.another_user)
        response = self.client.get(reverse(self.expense_url))
        self.assertEqual(response.data['count'], 0)
        self.authenticate(self.user)
        response = self.client.get(reverse(self.expense_url))
        self.assertEqual(response.data['count'], quantity_expenses)

    def test_expense_list_returns_expenses(self):
        self.authenticate(self.user)
        quantity_expenses = 10
        self.make_expenses(self.user, quantity_expenses)
        response = self.client.get(reverse(self.expense_url))
        self.assertEqual(response.data['count'], quantity_expenses)

    def test_create_expense_is_status_code_201_created(self):
        self.expense_data['categories'] = [
            c.id for c in self.make_categories(self.user, 1)]
        self.authenticate(self.user)
        response = self.client.post(
            reverse(self.expense_url), self.expense_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_expense_with_invalid_data_is_status_code_400_bad_request(self):
        self.authenticate(self.user)
        wrong_data = {
            'name': '943-583498694 Name',
            'description': 'This is a $%)$%*&$%& description.',
            'value': '100,00',
            'categories': ['fbiuabfwfbiwufbi'],
            'date': "92429238",
            'status': "test",
        }
        response = self.client.post(reverse(self.expense_url), wrong_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)
        self.assertIn('description', response.data)
        self.assertIn('value', response.data)
        self.assertIn('categories', response.data)
        self.assertIn('date', response.data)
        self.assertIn('status', response.data)

    def test_create_expense_without_authentication_is_status_code_401_unauthorized(self):
        self.expense_data['categories'] = [
            c.id for c in self.make_categories(self.user, 1)]
        response = self.client.post(
            reverse(self.expense_url), self.expense_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_expense_data_is_saved_correctly(self):
        self.authenticate(self.user)
        self.expense_data['categories'] = [
            c.id for c in self.make_categories(self.user, 1)]
        response = self.client.post(
            reverse(self.expense_url), self.expense_data)
        self.assertEqual(response.data['name'], self.expense_data['name'])
        self.assertEqual(response.data['description'],
                         self.expense_data['description'])
        self.assertEqual(response.data['value'],
                         str(self.expense_data['value']))
        self.assertEqual(response.data['date'], str(self.expense_data['date']))
        self.assertEqual(response.data['status'], self.expense_data['status'])
        self.assertEqual(set(response.data['categories']),
                         set(self.expense_data['categories']))

    def test_retrieve_expense_is_status_code_200_ok(self):
        self.authenticate(self.user)
        expense = self.make_expenses(self.user, 1)[0]
        response = self.client.get(
            reverse(self.expense_detail_url, kwargs={'pk': expense.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_expense_without_authentication_is_status_code_401_unauthorized(self):
        expense = self.make_expenses(self.user, 1)[0]
        response = self.client.get(
            reverse(self.expense_detail_url, kwargs={'pk': expense.id}),)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_non_existent_expense_is_status_code_404_not_found(self):
        self.authenticate(self.user)
        response = self.client.get(
            reverse(self.expense_detail_url, kwargs={'pk': uuid.uuid4()}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_expense_fields_is_expected(self):
        self.authenticate(self.user)
        expense = self.make_expenses(self.user, 1)[0]
        expected_fields = {'id', 'name', 'value', 'categories',
                           'date', 'description', 'status', }
        response = self.client.get(
            reverse(self.expense_detail_url, kwargs={'pk': expense.id}))
        self.assertEqual(set(response.data.keys()), expected_fields)

    def test_retrieve_expense_created_by_another_user_is_status_code_404_not_found(self):
        expense = self.make_expenses(self.user, 1)[0]
        self.authenticate(self.another_user)
        response = self.client.get(
            reverse(self.expense_detail_url, kwargs={'pk': expense.id}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_expense_is_status_code_200_ok(self):
        self.authenticate(self.user)
        expense = self.make_expenses(self.user, 1)[0]
        updated_data = {
            'name': 'Expense Updated Name',
            'description': 'This is a test expense updated description.',
            'value': Decimal('500.00'),
            'date': date(year=2023, month=1, day=1),
            'status': Expense.STATUS_CHOICES[1][0],
        }
        response = self.client.put(
            reverse(self.expense_detail_url, kwargs={'pk': expense.id}),
            data=updated_data,)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_expense_data_is_updated_correctly(self):
        self.authenticate(self.user)
        expense = self.make_expenses(self.user, 1)[0]
        updated_data = {
            'name': 'Expense Updated Name',
            'description': 'This is a test expense updated description.',
            'value': Decimal('500.00'),
            'date': date(year=2023, month=1, day=1),
            'status': Expense.STATUS_CHOICES[1][0],
        }
        response = self.client.put(
            reverse(self.expense_detail_url, kwargs={'pk': expense.id}),
            data=updated_data,)
        self.assertEqual(response.data['name'], updated_data['name'])
        self.assertEqual(
            response.data['description'], updated_data['description'])
        self.assertEqual(response.data['value'], str(updated_data['value']))
        self.assertEqual(response.data['date'], str(updated_data['date']))
        self.assertEqual(response.data['status'], updated_data['status'])

    def test_update_expense_with_invalid_data_is_status_code_400_bad_request(self):
        self.authenticate(self.user)
        expense = self.make_expenses(self.user, 1)[0]
        updated_data = {
            'name': 'Expense 385039853904583&%%& Name',
            'description': 'This i%¨*(#) expense updated description.',
            'value': '500,00',
            'date': 'f,erfpofjpe',
            'status': 'owepfpoerfjop',
        }
        response = self.client.put(
            reverse(self.expense_detail_url, kwargs={'pk': expense.id}),
            data=updated_data,)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_expense_without_authentication_is_status_code_401_unauthorized(self):
        expense = self.make_expenses(self.user, 1)[0]
        updated_data = {
            'name': 'Expense Updated Name',
            'description': 'This is a test expense updated description.',
            'value': Decimal('500.00'),
            'date': date(year=2023, month=1, day=1),
            'status': Expense.STATUS_CHOICES[1][0],
        }
        response = self.client.put(
            reverse(self.expense_detail_url, kwargs={'pk': expense.id}),
            data=updated_data,)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_non_existent_expense_is_status_code_404_not_found(self):
        self.authenticate(self.user)
        response = self.client.put(
            reverse(self.expense_detail_url, kwargs={'pk': uuid.uuid4()}),
            data={})
        self.assertEqual(response.status_code,
                         status.HTTP_404_NOT_FOUND)

    def test_update_expense_created_by_another_user_is_status_code_404_not_found(self):
        expense = self.make_expenses(self.user, 1)[0]
        self.authenticate(self.another_user)
        response = self.client.put(
            reverse(self.expense_detail_url, kwargs={'pk': expense.id}),
            data={})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_partial_update_expense_is_status_code_200_ok(self):
        self.authenticate(self.user)
        expense = self.make_expenses(self.user, 1)[0]
        updated_data = {'name': 'Expense Updated Name', }
        response = self.client.patch(
            reverse(self.expense_detail_url, kwargs={'pk': expense.id}),
            data=updated_data,)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @parameterized.expand([
        ('name', 'Partial updated expense name'),
        ('description', 'This is a partial updated expense description.'),
        ('value', Decimal('500.00')),
        ('date', date(year=2023, month=1, day=1)),
        ('status', Expense.STATUS_CHOICES[1][0]),
    ])
    def test_partial_update_expense_data_is_updated_correctly(self, field, value):
        self.authenticate(self.user)
        expense = self.make_expenses(self.user, 1)[0]
        response = self.client.patch(
            reverse(self.expense_detail_url, kwargs={'pk': expense.id}),
            data={field: value},)
        self.assertEqual((response.data[field]), str(value))

    @parameterized.expand([
        ('name', '399835349579347'),
        ('name', '~[]~[]]'),
        ('name', ''),
        ('description', '3975894%%$%$%$%'),
        ('value', '500,00'),
        ('value', '500.000'),
        ('date', '2022,01,01'),
        ('date', '2022/01/01'),
        ('status', 'rjgoeigjoer'),
        ('status', ''),
    ])
    def test_partial_update_expense_with_invalid_data_is_status_code_400_bad_request(self, field, value):
        self.authenticate(self.user)
        expense = self.make_expenses(self.user, 1)[0]
        response = self.client.patch(
            reverse(self.expense_detail_url, kwargs={'pk': expense.id}),
            data={field: value},)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_partial_update_expense_without_authentication_is_status_code_401_unauthorized(self):
        expense = self.make_expenses(self.user, 1)[0]
        updated_data = {
            'name': 'Partial updated expense name', }
        response = self.client.patch(
            reverse(self.expense_detail_url, kwargs={'pk': expense.id}),
            data=updated_data,)
        self.assertEqual(response.status_code,
                         status.HTTP_401_UNAUTHORIZED)

    def test_partial_update_non_existent_category_is_status_code_404_not_found(self):
        self.authenticate(self.user)
        response = self.client.patch(
            reverse(self.expense_detail_url, kwargs={'pk': uuid.uuid4()}),
            data={})
        self.assertEqual(response.status_code,
                         status.HTTP_404_NOT_FOUND)

    def test_partial_update_expense_created_by_another_user_is_status_code_404_not_found(self):
        expense = self.make_expenses(self.user, 1)[0]
        self.authenticate(self.another_user)
        response = self.client.patch(
            reverse(self.expense_detail_url, kwargs={'pk': expense.id}),
            data={})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_destroy_expense_is_status_code_204_no_content(self):
        self.authenticate(self.user)
        expense = self.make_expenses(self.user, 1)[0]
        response = self.client.delete(
            reverse(self.expense_detail_url, kwargs={'pk': expense.id}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_destroy_expense_without_authentication_is_status_code_401_unauthorized(self):
        expense = self.make_expenses(self.user, 1)[0]
        response = self.client.delete(
            reverse(self.expense_detail_url, kwargs={'pk': expense.id}))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_destroy_non_existent_expense_is_status_code_404_not_found(self):
        self.authenticate(self.user)
        response = self.client.delete(
            reverse(self.expense_detail_url, kwargs={'pk': uuid.uuid4()}))
        self.assertEqual(response.status_code,
                         status.HTTP_404_NOT_FOUND)

    def test_destroy_expense_created_by_another_user_is_status_code_404_not_found(self):
        expense = self.make_expenses(self.user, 1)[0]
        self.authenticate(self.another_user)
        response = self.client.delete(
            reverse(self.expense_detail_url, kwargs={'pk': expense.id}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_expense_add_category_is_status_code_200_ok(self):
        self.authenticate(self.user)
        expense = self.make_expenses(self.user, 1)[0]
        expense_add_category_data = {
            'categories': [c.id for c in self.make_categories(self.user, 1)]}
        response = self.client.post(
            reverse(self.expense_action_add_category_url,
                    kwargs={'pk': expense.id}),
            data=expense_add_category_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_expense_add_category_with_invalid_data_is_status_code_400_bad_request(self):
        self.authenticate(self.user)
        expense = self.make_expenses(self.user, 1)[0]
        expense_add_category_data = {
            'categories': ['iivjwivsjpsvspvjpsdv']}
        response = self.client.post(
            reverse(self.expense_action_add_category_url,
                    kwargs={'pk': expense.id}),
            data=expense_add_category_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_expense_add_category_is_correct_data(self):
        self.authenticate(self.user)
        expense = self.make_expenses(self.user, 1)[0]
        categories_ids_for_add = {
            str(c.id) for c in self.make_categories(self.user, 5)}
        expense_add_category_data = {
            'categories': categories_ids_for_add}
        response = self.client.post(
            reverse(self.expense_action_add_category_url,
                    kwargs={'pk': expense.id}),
            data=expense_add_category_data)
        expense_category_ids = {c['id'] for c in response.data['categories']}
        self.assertTrue(categories_ids_for_add.issubset(expense_category_ids))

    def test_expense_remove_category_is_status_code_204_no_content(self):
        self.authenticate(self.user)
        expense = self.make_expenses(self.user, 1)[0]
        expense_add_category_data = {
            'categories': [expense.categories.all()[0].id]}
        response = self.client.post(
            reverse(self.expense_action_remove_category_url,
                    kwargs={'pk': expense.id}),
            data=expense_add_category_data)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_expense_remove_category_with_invalid_data_is_status_code_400_bad_request(self):
        self.authenticate(self.user)
        expense = self.make_expenses(self.user, 1)[0]
        expense_add_category_data = {
            'categories': ['iivjwivsjpsvspvjpsdv']}
        response = self.client.post(
            reverse(self.expense_action_remove_category_url,
                    kwargs={'pk': expense.id}),
            data=expense_add_category_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_expense_remove_category_is_successful(self):
        self.authenticate(self.user)
        expense = self.make_expenses(self.user, 1)[0]
        id_category_to_remove = expense.categories.all()[0].id
        expense_add_category_data = {
            'categories': [id_category_to_remove]}
        self.client.post(
            reverse(self.expense_action_remove_category_url,
                    kwargs={'pk': expense.id}),
            data=expense_add_category_data)
        self.assertTrue(Category.objects.filter(
            id=id_category_to_remove).exists())
        with self.assertRaises(Category.DoesNotExist):
            expense.categories.get(id=id_category_to_remove)
