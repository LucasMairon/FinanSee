from rest_framework import serializers

from categories.models import Category


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ('id', 'name', 'description')

    def create(self, validated_data):
        validated_data['user'] = self.context.get('user')
        if not validated_data['user']:
            raise ValueError(
                "User must be provided in context or is None.")
        return super().create(validated_data)
