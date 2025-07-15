from expenses.api.serializers import ExpenseSerializer
from periods.models import Period
from rest_framework import serializers


class PeriodSerializer(serializers.ModelSerializer):
    expenses = ExpenseSerializer(many=True, read_only=True)
    gasto_mensal = serializers.SerializerMethodField()
    saldo = serializers.SerializerMethodField()

    class Meta:
        model = Period
        fields = ('id', 'expenses', 'gasto_mensal', 'saldo', 'user_balance')

    def get_gasto_mensal(self, obj):
        return sum(expense.value for expense in obj.expenses.all())

    def get_saldo(self, obj):
        return float(obj.user_balance) - float(self.get_gasto_mensal(obj))
