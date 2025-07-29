from categories.api.serializers import CategorySerializer
from drf_spectacular.utils import OpenApiExample, extend_schema_serializer
from expenses.models import Expense
from periods.models import Period
from rest_framework import serializers


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Expense Example',
            value={
                'id': '550e8400-e29b-41d4-a716-446655440000',
                'name': 'Grocery Shopping',
                'value': '150.50',
                'categories': [
                    {
                        'id': '550e8400-e29b-41d4-a716-446655440001',
                        'name': 'Food',
                        'description': 'Expenses related to food and meals'
                    }
                ],
                'date': '2024-01-15',
                'description': 'Weekly grocery shopping at supermarket',
                'status': 'AP'
            },
            description='Example of a complete expense with categories'
        )
    ]
)
class ExpenseSerializer(serializers.ModelSerializer):
    """
    Serializer for the Expense model.

    Provides complete expense data including nested category information.
    Used for listing and retrieving expenses.
    """

    categories = CategorySerializer(many=True)

    class Meta:
        model = Expense
        fields = ('id', 'name', 'value', 'categories',
                  'date', 'description', 'status',)
        extra_kwargs = {
            'id': {
                'read_only': True,
                'help_text': 'Unique expense ID (auto-generated)'
            },
            'name': {
                'help_text': 'Name of the expense (e.g., Grocery Shopping)',
                'max_length': 255
            },
            'value': {
                'help_text': 'Amount of the expense (decimal format)'
            },
            'categories': {
                'help_text': 'List of categories associated with this expense'
            },
            'date': {
                'help_text': 'Date when the expense occurred',
                'required': False
            },
            'description': {
                'help_text': 'Additional details about the expense',
                'required': False
            },
            'status': {
                'help_text': 'Payment status (AP, P)'
            }
        }


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Create Expense',
            value={
                'name': 'New Expense',
                'value': '100.00',
                'categories': ['550e8400-e29b-41d4-a716-446655440001'],
                'date': '2024-01-20',
                'description': 'New expense description',
                'status': 'AP'
            },
            description='Example of expense creation'
        ),
        OpenApiExample(
            'Update Expense',
            value={
                'name': 'Updated Grocery Shopping',
                'value': '175.00',
                'categories': ['550e8400-e29b-41d4-a716-446655440001'],
                'date': '2024-01-15',
                'description': 'Updated weekly grocery shopping',
                'status': 'AP'
            },
            description='Example of expense update'
        )

    ]
)
class ExpenseCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new expenses.

    Automatically associates the expense with the user and appropriate period.
    """

    class Meta:
        model = Expense
        fields = ('id', 'name', 'value', 'categories',
                  'date', 'description', 'status',)
        extra_kwargs = {
            'id': {
                'read_only': True,
                'help_text': 'Unique expense ID (auto-generated)'
            },
            'name': {
                'help_text': 'Name of the new expense'
            },
            'value': {
                'help_text': 'Amount of the new expense'
            },
            'categories': {
                'help_text': 'List of category IDs for this expense'
            },
            'date': {
                'help_text': 'Date when the expense occurred'
            },
            'description': {
                'help_text': 'Description of the new expense',
                'required': False
            },
            'status': {
                'help_text': 'Initial payment status'
            }
        }

    def create(self, validated_data):
        """
        Creates a new expense and associates it with user and period.

        Args:
            validated_data: Validated expense data

        Returns:
            Expense: Newly created expense

        Raises:
            ValueError: If user is not available in context
        """
        user = self.context.get('user')
        if not user:
            raise ValueError(
                "User must be provided in context or is None.")
        validated_data['user'] = user
        validated_data['period'] = Period.objects.get_or_create(
            user=user, month=validated_data['date'])[0]
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """
        Updates an expense and handles period reassignment if date changes.

        Args:
            instance: Existing expense instance
            validated_data: Validated update data

        Returns:
            Expense: Updated expense instance
        """
        date = validated_data.get('date')
        if date and (instance.period.month.year != date.year or
                     instance.period.month.month != date.month):
            validated_data['period'] = Period.objects.get_or_create(
                user=instance.user, month=date)[0]
        return super().update(instance, validated_data)
