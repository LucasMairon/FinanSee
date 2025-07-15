from categories.api.serializers import CategorySerializer
from expenses.models import Expense
from periods.models import Period
from rest_framework import serializers


class ExpenseSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(many=True)

    class Meta:
        model = Expense
        fields = ('id', 'name', 'value', 'categories',
                  'date', 'description', 'status',)


class ExpenseUpdateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Expense
        fields = ('name', 'value', 'date', 'description', 'status',)

    def update(self, instance, validated_data):
        date = validated_data.get('date')
        if date and (instance.period.month.year != date.year or
                     instance.period.month.month != date.month):
            validated_data['period'] = Period.objects.get_or_create(
                user=instance.user, month=date)[0]
        return super().update(instance, validated_data)


class ExpenseCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Expense
        fields = ('name', 'value', 'categories',
                  'date', 'description', 'status',)

    def create(self, validated_data):
        user = self.context.get('user')
        if not user:
            raise ValueError(
                "User must be provided in context or is None.")
        validated_data['user'] = user
        validated_data['period'] = Period.objects.get_or_create(
            user=user, month=validated_data['date'])[0]
        return super().create(validated_data)


class ExpenseCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Expense
        fields = ('categories',)

    def update(self, instance, validated_data):
        add_category = self.context.get('add_category')
        remove_category = self.context.get('remove_category')
        if add_category is True and remove_category in (None, False):
            instance.categories.set(validated_data['categories'])
        elif remove_category is True and add_category in (None, False):
            instance.categories.remove(*validated_data['categories'])
        else:
            raise ValueError(
                "add_category and remove_category cannot"
                "be both True, False or None at the same time."
            )
        return instance
