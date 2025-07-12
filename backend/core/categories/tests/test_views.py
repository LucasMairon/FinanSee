import uuid

from categories.models import Category
from django.contrib.auth import get_user_model
from django.urls import reverse
from parameterized import parameterized
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class CategoryViewSetTestCase(APITestCase):

    def setUp(self):
        self.category_url = 'category-list'
        self.category_detail_url = 'category-detail'
        self.user = User.objects.create_user(
            email='test@test.com',
            password='testpassword'
        )
        self.another_user = User.objects.create_user(
            email='another_user@anoter_user.com',
            password='anotherpassword'
        )
        self.category_data = {
            'name': 'Category name',
            'description': 'This is a category description.'
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

    def authenticate(self, user):
        refresh_token = RefreshToken.for_user(user)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {refresh_token.access_token}')

    def test_list_categories_is_status_code_200_ok(self):
        self.authenticate(self.user)
        response = self.client.get(reverse(self.category_url))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_categories_without_authentication_is_status_code_401_unauthorized(self):
        response = self.client.get(reverse(self.category_url))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_categories_created_by_another_user_not_visible(self):
        quantity_categories = 5
        self.make_categories(self.user, quantity_categories)
        self.authenticate(self.another_user)
        response = self.client.get(reverse(self.category_url))
        self.assertEqual(response.data['count'], 0)
        self.authenticate(self.user)
        response = self.client.get(reverse(self.category_url))
        self.assertEqual(response.data['count'], quantity_categories)

    def test_category_list_returns_categories(self):
        self.authenticate(self.user)
        quantity_categories = 10
        self.make_categories(self.user, quantity_categories)
        response = self.client.get(reverse(self.category_url))
        self.assertEqual(response.data['count'], quantity_categories)

    def test_create_category_is_status_code_201_created(self):
        self.authenticate(self.user)
        response = self.client.post(
            reverse(self.category_url), self.category_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_category_with_invalid_data_is_status_code_400_bad_request(self):
        self.authenticate(self.user)
        data = {
            'name': '3223^}}',
            'description': 'This is a new category.'
        }
        response = self.client.post(reverse(self.category_url), data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

    def test_create_category_without_authentication_is_status_code_401_unauthorized(self):
        response = self.client.post(
            reverse(self.category_url), self.category_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_category_data_is_saved_correctly(self):
        self.authenticate(self.user)
        response = self.client.post(
            reverse(self.category_url), self.category_data)
        self.assertEqual(response.data['name'], self.category_data['name'])
        self.assertEqual(response.data['description'],
                         self.category_data['description'])

    def test_retrieve_category_is_status_code_200_ok(self):
        self.authenticate(self.user)
        category = self.make_categories(self.user, 1)[0]
        response = self.client.get(
            reverse(self.category_detail_url, kwargs={'pk': category.id})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_category_without_authentication_is_status_code_401_unauthorized(self):
        category = self.make_categories(self.user, 1)[0]
        response = self.client.get(
            reverse(self.category_detail_url, kwargs={'pk': category.id}),
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_non_existent_category_is_status_code_404_not_found(self):
        self.authenticate(self.user)
        response = self.client.get(
            reverse(self.category_detail_url, kwargs={'pk': uuid.uuid4()})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_category_fields_is_expected(self):
        self.authenticate(self.user)
        category = self.make_categories(self.user, 1)[0]
        expected_fields = {'id', 'name', 'description'}
        response = self.client.get(
            reverse(self.category_detail_url, kwargs={'pk': category.id})
        )
        self.assertEqual(set(response.data.keys()), expected_fields)

    def test_retrieve_category_created_by_another_user_is_status_code_404_not_found(self):
        category = self.make_categories(self.user, 1)[0]
        self.authenticate(self.another_user)
        response = self.client.get(
            reverse(self.category_detail_url, kwargs={'pk': category.id})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_category_is_status_code_200_ok(self):
        self.authenticate(self.user)
        category = self.make_categories(self.user, 1)[0]
        update_data = {
            'name': 'Updated category name',
            'description': 'This is an updated category description.'
        }
        response = self.client.put(
            reverse(self.category_detail_url, kwargs={'pk': category.id}),
            data=update_data,
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_category_data_is_updated_correctly(self):
        self.authenticate(self.user)
        category = self.make_categories(self.user, 1)[0]
        update_data = {
            'name': 'Updated category name',
            'description': 'This is an updated category description.'
        }
        response = self.client.put(
            reverse(self.category_detail_url, kwargs={'pk': category.id}),
            data=update_data,
        )
        self.assertEqual(response.data['name'], update_data['name'])
        self.assertEqual(
            response.data['description'], update_data['description'])

    def test_update_category_with_invalid_data_is_status_code_400_bad_request(self):
        self.authenticate(self.user)
        category = self.make_categories(self.user, 1)[0]
        update_data = {
            'name': '9753984935~[~]]',
            'description': 'This is an updated category description.'
        }
        response = self.client.put(
            reverse(self.category_detail_url, kwargs={'pk': category.id}),
            data=update_data,
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_category_without_authentication_is_status_code_401_unauthorized(self):
        category = self.make_categories(self.user, 1)[0]
        update_data = {
            'name': 'Updated category name',
            'description': 'This is an updated category description.'
        }
        response = self.client.put(
            reverse(self.category_detail_url, kwargs={'pk': category.id}),
            data=update_data,
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_non_existent_category_is_status_code_404_not_found(self):
        self.authenticate(self.user)
        response = self.client.put(
            reverse(self.category_detail_url, kwargs={'pk': uuid.uuid4()}),
            data={}
        )
        self.assertEqual(response.status_code,
                         status.HTTP_404_NOT_FOUND)

    def test_update_category_created_by_another_user_is_status_code_404_not_found(self):
        category = self.make_categories(self.user, 1)[0]
        self.authenticate(self.another_user)
        response = self.client.put(
            reverse(self.category_detail_url, kwargs={'pk': category.id}),
            data={}
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_partial_update_category_is_status_code_200_ok(self):
        self.authenticate(self.user)
        category = self.make_categories(self.user, 1)[0]
        update_data = {
            'name': 'Updated category name',
        }
        response = self.client.patch(
            reverse(self.category_detail_url, kwargs={'pk': category.id}),
            data=update_data,
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @parameterized.expand([
        ('name', 'Partial updated category name'),
        ('description', 'This is a partial updated category description.')
    ])
    def test_partial_update_category_data_is_updated_correctly(self, field, value):
        self.authenticate(self.user)
        category = self.make_categories(self.user, 1)[0]
        response = self.client.patch(
            reverse(self.category_detail_url, kwargs={'pk': category.id}),
            data={field: value},
        )
        self.assertEqual(response.data[field], value)

    @parameterized.expand([
        ('name', '399835349579347'),
        ('name', '~[]~[]]'),
        ('name', ''),
        ('description', ''),
    ])
    def test_partial_update_category_with_invalid_data_is_status_code_400_bad_request(self, field, value):
        self.authenticate(self.user)
        category = self.make_categories(self.user, 1)[0]
        response = self.client.patch(
            reverse(self.category_detail_url, kwargs={'pk': category.id}),
            data={field: value},
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_partial_update_category_without_authentication_is_status_code_401_unauthorized(self):
        category = self.make_categories(self.user, 1)[0]
        update_data = {
            'name': 'Partial updated category name',
            'description': 'This is a partial updated category description.'
        }
        response = self.client.patch(
            reverse(self.category_detail_url, kwargs={'pk': category.id}),
            data=update_data,
        )
        self.assertEqual(response.status_code,
                         status.HTTP_401_UNAUTHORIZED)

    def test_partial_update_non_existent_category_is_status_code_404_not_found(self):
        self.authenticate(self.user)
        response = self.client.patch(
            reverse(self.category_detail_url, kwargs={'pk': uuid.uuid4()}),
            data={}
        )
        self.assertEqual(response.status_code,
                         status.HTTP_404_NOT_FOUND)

    def test_partial_update_category_created_by_another_user_is_status_code_404_not_found(self):
        category = self.make_categories(self.user, 1)[0]
        self.authenticate(self.another_user)
        response = self.client.patch(
            reverse(self.category_detail_url, kwargs={'pk': category.id}),
            data={}
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_destroy_category_is_status_code_204_no_content(self):
        self.authenticate(self.user)
        category = self.make_categories(self.user, 1)[0]
        response = self.client.delete(
            reverse(self.category_detail_url, kwargs={'pk': category.id})
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_destroy_category_without_authentication_is_status_code_401_unauthorized(self):
        category = self.make_categories(self.user, 1)[0]
        response = self.client.delete(
            reverse(self.category_detail_url, kwargs={'pk': category.id})
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_destroy_non_existent_category_is_status_code_404_not_found(self):
        self.authenticate(self.user)
        response = self.client.delete(
            reverse(self.category_detail_url, kwargs={'pk': uuid.uuid4()})
        )
        self.assertEqual(response.status_code,
                         status.HTTP_404_NOT_FOUND)

    def test_destroy_category_created_by_another_user_is_status_code_404_not_found(self):
        category = self.make_categories(self.user, 1)[0]
        self.authenticate(self.another_user)
        response = self.client.delete(
            reverse(self.category_detail_url, kwargs={'pk': category.id})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
