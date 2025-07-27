from categories.models import Category
from drf_spectacular.utils import OpenApiExample, extend_schema_serializer
from rest_framework import serializers


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Category Example',
            value={
                'id': '550e8400-e29b-41d4-a716-446655440000',
                'name': 'Food',
                'description': 'Expenses related to food and meals'
            },
            description='Example of an expense category'
        )
    ]
)
class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the Category model.

    Allows creating, listing, updating and deleting expense categories.
    The 'user' field is automatically set based on the context.
    """
    class Meta:
        model = Category
        fields = ('id', 'name', 'description')
        extra_kwargs = {
            'id': {
                'read_only': True,
                'help_text': 'Unique category ID (auto-generated)'
            },
            'name': {
                'help_text': 'Category name (e.g., Food, Transportation)',
                'max_length': 255
            },
            'description': {
                'help_text': 'Detailed description of the category',
                'required': True
            }
        }

    def create(self, validated_data):
        """
        Creates a new category automatically associating it with the user
        from context.

        Args:
            validated_data: Validated category data

        Returns:
            Category: Newly created category

        Raises:
            ValueError: If user is not available in context
        """
        validated_data['user'] = self.context.get('user')
        if not validated_data['user']:
            raise ValueError(
                "User must be provided in context or is None.")
        return super().create(validated_data)
