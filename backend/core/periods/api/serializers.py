from expenses.api.serializers import ExpenseSerializer
from periods.models import Period
from rest_framework import serializers


class PeriodSerializer(serializers.ModelSerializer):
    expenses = ExpenseSerializer(many=True, read_only=True)
    monthly_expense = serializers.SerializerMethodField()
    balance = serializers.SerializerMethodField()

    class Meta:
        model = Period
        fields = ('id', 'expenses', 'monthly_expense',
                  'balance', 'user_balance', 'month')

    def get_monthly_expense(self, obj):
        monthly_expense = 0.0
        for expense in obj.expenses.all():
            monthly_expense += float(expense.value)
        return monthly_expense

    def get_balance(self, obj):
        return float(obj.user_balance) - float(self.get_monthly_expense(obj))


class PeriodPDFSerializer(serializers.Serializer):
    date = serializers.DateField()
