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
            'Update Expense',
            value={
                'name': 'Updated Grocery Shopping',
                'value': '175.00',
                'date': '2024-01-15',
                'description': 'Updated weekly grocery shopping',
                'status': 'AP'
            },
            description='Example of expense update'
        )
    ]
)
class ExpenseUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating existing expenses.

    Automatically handles period reassignment when date changes.
    """

    class Meta:
        model = Expense
        fields = ('name', 'value', 'date', 'description', 'status',)
        extra_kwargs = {
            'name': {
                'help_text': 'Updated name of the expense'
            },
            'value': {
                'help_text': 'Updated amount of the expense'
            },
            'date': {
                'help_text': 'Updated date of the expense'
            },
            'description': {
                'help_text': 'Updated description of the expense',
                'required': False
            },
            'status': {
                'help_text': 'Updated payment status'
            }
        }

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
        )
    ]
)
class ExpenseCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new expenses.

    Automatically associates the expense with the user and appropriate period.
    """

    class Meta:
        model = Expense
        fields = ('name', 'value', 'categories',
                  'date', 'description', 'status',)
        extra_kwargs = {
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


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Add Categories',
            value={
                'categories': ['550e8400-e29b-41d4-a716-446655440001']
            },
            description='Example of adding categories to an expense'
        ),
        OpenApiExample(
            'Remove Categories',
            value={
                'categories': ['550e8400-e29b-41d4-a716-446655440002']
            },
            description='Example of removing categories from an expense'
        )
    ]
)
class ExpenseCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for managing expense categories.

    Supports adding and removing categories from existing expenses.
    """

    class Meta:
        model = Expense
        fields = ('categories',)
        extra_kwargs = {
            'categories': {
                'help_text': 'List of category IDs to add or remove'
            }
        }

    def update(self, instance, validated_data):
        """
        Adds or removes categories from an expense based on context.

        Args:
            instance: Existing expense instance
            validated_data: Validated category data

        Returns:
            Expense: Updated expense instance

        Raises:
            ValueError: If add_category and remove_category are both True/False
        """
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
