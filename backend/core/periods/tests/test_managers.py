from datetime import date

from django.contrib.auth import get_user_model
from django.test import TestCase
from periods.models import Period

User = get_user_model()


class PeriodManagerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            name='Test User',
            email='test@test.com',
            cpf='33887670094',
            date_of_birth='2000-01-01',
            phone_number='33887670094',
            income='5000.00',
            password='testpassword123',
        )
        return super().setUp()

    def test_create_period_by_date_is_success(self):
        date_for_create_period = date(year=2026, month=3, day=7)
        period = Period.objects.create_period_by_date(
            self.user, date_for_create_period)
        self.assertEqual(period.month.year, date_for_create_period.year)
        self.assertEqual(period.month.month, date_for_create_period.month)
        self.assertEqual(period.user, self.user)

    def test_get_period_by_date_is_success(self):
        date_for_get_period = date(year=2026, month=3, day=7)
        period_created = Period.objects.create_period_by_date(
            self.user, date_for_get_period)
        period_retrieved = Period.objects.get_period_by_date(
            self.user, date_for_get_period)
        self.assertEqual(period_retrieved, period_created)

    def test_create_current_period_is_success(self):
        today_date = date.today()
        period = Period.objects.create_current_period(self.user)
        self.assertEqual(period.month.year, today_date.year)
        self.assertEqual(period.month.month, today_date.month)

    def test_get_current_period_is_success(self):
        period_created = Period.objects.create_current_period(self.user)
        period_retrieved = Period.objects.get_current_period(self.user)
        self.assertEqual(period_retrieved, period_created)

    def test_get_or_create_is_created_period_without_date_specific(self):
        period, created = Period.objects.get_or_create(user=self.user)
        self.assertTrue(created)
        self.assertIsInstance(period, Period)

    def test_get_or_create_is_created_period_with_date_specific(self):
        date_for_create_period = date(year=2026, month=3, day=7)
        period, created = Period.objects.get_or_create(
            user=self.user, month=date_for_create_period)
        self.assertTrue(created)
        self.assertIsInstance(period, Period)

    def test_get_or_create_retrieve_current_period(self):
        Period.objects.create_current_period(self.user)
        period, created = Period.objects.get_or_create(user=self.user)
        self.assertFalse(created)
        self.assertIsInstance(period, Period)

    def test_get_or_create_retrieve_specific_period(self):
        date_of_created_period = date(year=2026, month=3, day=7)
        Period.objects.create_period_by_date(self.user, date_of_created_period)
        period, created = Period.objects.get_or_create(
            user=self.user, month=date_of_created_period)
        self.assertFalse(created)
        self.assertIsInstance(period, Period)
