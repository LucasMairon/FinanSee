from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

from rest_framework.test import APITestCase
from rest_framework.serializers import ValidationError

from parameterized import parameterized

from users.api.serializers import UserSerializer, UserCreateSerializer


User = get_user_model()


class UserSerializerTestCase(APITestCase):
    def setUp(self):
        self.data = {
            'name': 'Test User',
            'email': 'test@test.com',
            'cpf': '33887670094',
            'date_of_birth': '2000-01-01',
            'phone_number': '33887670094',
            'income': '5000.00',
            'password': 'testpassword123',
        }

    def test_user_serializer_data_is_valid(self):
        serializer = UserCreateSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())

    def test_user_serializer_create_data_is_correct_(self):
        serializer = UserCreateSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertEqual(user.name, self.data['name'])
        self.assertEqual(user.email, self.data['email'])
        self.assertEqual(user.cpf, self.data['cpf'])
        self.assertEqual(str(user.date_of_birth),
                         self.data['date_of_birth'])
        self.assertEqual(user.phone_number, self.data['phone_number'])
        self.assertEqual(str(user.income), str(self.data['income']))

    def test_user_serializer_create_user(self):
        serializer = UserCreateSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        self.assertIsNotNone(user)

    def test_user_authentication(self):
        serializer = UserCreateSerializer(data=self.data)
        self.assertTrue(serializer.is_valid())
        user = serializer.save()
        authenticated_user = authenticate(
            username=user.email, password=self.data['password'])
        self.assertIsNotNone(authenticated_user)
        self.assertEqual(authenticated_user, user)

    def test_user_serializer_fields(self):
        user = User.objects.create_user(**self.data)
        serializer = UserSerializer(instance=user)
        expected_fields = {
            'id', 'name', 'email', 'cpf',
            'date_of_birth', 'phone_number', 'income'
        }
        self.assertEqual(set(serializer.data.keys()), expected_fields)

    def test_user_create_serializer_fields(self):
        user = User.objects.create_user(**self.data)
        serializer = UserCreateSerializer(instance=user)
        expected_fields = {
            'name', 'email', 'cpf', 'date_of_birth',
            'phone_number', 'income', 'password'
        }
        self.assertEqual(set(serializer.data.keys()), expected_fields)

    def test_user_serializer_update_is_successful(self):
        user = User.objects.create_user(**self.data)
        update_data = {
            'name': 'Updated User',
            'email': 'update@update.com',
            'cpf': '36999310050',
            'date_of_birth': '1990-01-03',
            'phone_number': '33887670084',
            'income': '4000.00',
            'password': 'updatedpassword123',
        }
        serializer = UserSerializer(instance=user, data=update_data)
        serializer.is_valid(raise_exception=True)
        updated_user = serializer.save()
        self.assertEqual(updated_user.name, update_data['name'])
        self.assertEqual(updated_user.email, update_data['email'])
        self.assertEqual(updated_user.cpf, update_data['cpf'])
        self.assertEqual(str(updated_user.date_of_birth),
                         update_data['date_of_birth'])
        self.assertEqual(updated_user.phone_number,
                         update_data['phone_number'])
        self.assertEqual(str(updated_user.income), update_data['income'])

    @parameterized.expand([
        ('name', 'Partial Update Name'),
        ('email', 'partial@partial.com'),
        ('cpf', '60567634043'),
        ('date_of_birth', '1995-05-05'),
        ('phone_number', '12345678900'),
        ('income', '6000.00'),
    ])
    def test_user_serializer_partial_update_is_successful(self, field, value):
        user = User.objects.create_user(**self.data)
        serializer = UserSerializer(
            instance=user, data={field: value}, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_user = serializer.save()
        self.assertEqual(str(getattr(updated_user, field)), str(value))

    @parameterized.expand([
        ('name', '0905390458'),
        ('name', '^´[~;.;´[];'),
        ('email', 'invalidemail.com'),
        ('email', 'invalid@.com'),
        ('email', 'invalid@domain'),
        ('email', 'partialartial.com'),
        ('cpf', '11111111111'),
        ('cpf', '60564043'),
        ('cpf', 'difsfsfisdofdoshf'),
        ('date_of_birth', 'not-a-date'),
        ('date_of_birth', '1995-0-05'),
        ('date_of_birth', '2099-05-32'),
        ('date_of_birth', '2015-05-32'),
        ('phone_number', '12345'),
        ('phone_number', '12345678901234567890'),
        ('phone_number', '67890sa'),
        ('phone_number', 'fjofjweiofiwf'),
        ('income', 'not-a-number'),
        ('income', '10000000000.00'),
        ('income', '6000.000'),
        ('income', '6000,00'),
        ('income', '-6000.00'),
    ])
    def test_user_serializer_is_invalid_field(self, field, value):
        user = User.objects.create_user(**self.data)
        serializer = UserSerializer(
            instance=user, data={field: value}, partial=True)
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)
