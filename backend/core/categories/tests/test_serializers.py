from django.contrib.auth import get_user_model

from rest_framework.test import APITestCase
from rest_framework.serializers import ValidationError

from parameterized import parameterized

from categories.models import Category
from categories.api.serializers import CategorySerializer


User = get_user_model()


class CategorySerializerTestCase(APITestCase):
    def setUp(self):
        self.data = {
            'name': 'Test Category',
            'description': 'This is a test category.',
        }
        self.user = User.objects.create_user(
            name='Test User in category',
            email='test@test.com',
            cpf='33887670094',
            date_of_birth='2000-01-01',
            phone_number='33887670094',
            income='5000.00',
            password='testpassword123',
        )

    def test_category_serializer_data_is_valid(self):
        serializer = CategorySerializer(data=self.data)
        self.assertTrue(serializer.is_valid())

    def test_category_serializer_create_data_is_correct(self):
        serializer = CategorySerializer(
            data=self.data, context={'user': self.user})
        serializer.is_valid(raise_exception=True)
        category = serializer.save()
        self.assertEqual(category.name, self.data['name'])
        self.assertEqual(category.description, self.data['description'])
        self.assertEqual(category.user, self.user)

    def test_category_serializer_create_category_is_success(self):
        serializer = CategorySerializer(
            data=self.data, context={'user': self.user}
        )
        serializer.is_valid(raise_exception=True)
        category = serializer.save()
        self.assertIsNotNone(category)

    def test_category_serializer_fields_expected_is_correct(self):
        category = Category.objects.create(
            name=self.data['name'],
            description=self.data['description'],
            user=self.user
        )
        serializer = CategorySerializer(instance=category)
        expected_fields = {
            'id', 'name', 'description',
        }
        self.assertEqual(set(serializer.data.keys()), expected_fields)

    def test_category_serializer_update_is_successful(self):
        category = Category.objects.create(
            name=self.data['name'],
            description=self.data['description'],
            user=self.user
        )
        updated_data = {
            'name': 'Upadted Category',
            'description': "This is an updated test category"
        }
        serializer = CategorySerializer(instance=category, data=updated_data)
        serializer.is_valid(raise_exception=True)
        updated_category = serializer.save()
        self.assertEqual(updated_category.name, updated_data['name'])
        self.assertEqual(updated_category.description,
                         updated_data['description'])

    @parameterized.expand([
        ('name', 'Partial Update Name'),
        ('description', 'Partial Update Description')
    ])
    def test_category_serializer_partial_update_is_successful(self, field, value):
        category = Category.objects.create(
            name=self.data['name'],
            description=self.data['description'],
            user=self.user
        )
        serializer = CategorySerializer(
            instance=category, data={field: value}, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_user = serializer.save()
        self.assertEqual(str(getattr(updated_user, field)), str(value))

    def test_category_serializer_delete_is_successful(self):
        category = Category.objects.create(
            name=self.data['name'],
            description=self.data['description'],
            user=self.user
        )
        serializer = CategorySerializer(instance=category)
        category.delete()
        with self.assertRaises(Category.DoesNotExist):
            Category.objects.get(id=category.id)

    def test_category_serializer_create_without_user_fails(self):
        serializer = CategorySerializer(data=self.data)
        with self.assertRaises(ValueError):
            serializer.is_valid(raise_exception=True)
            serializer.save()

    @parameterized.expand([
        ('name', '905834853485340985'),
        ('name', '.,[][~-=]'),
    ])
    def test_category_serializer_is_invalid_field(self, field, value):
        category = Category.objects.create(**self.data, user=self.user)
        serializer = CategorySerializer(
            instance=category, data={field: value}, partial=True)
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)

    def test_category_serializer_field_is_required(self):
        serializer = CategorySerializer(data={})
        serializer.is_valid()
        self.assertIn('name', serializer.errors)
        for erro in serializer.errors['name']:
            self.assertEqual('required', erro.code)
        self.assertIn('description', serializer.errors)
        for erro in serializer.errors['description']:
            self.assertEqual('required', erro.code)
