from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'cpf', 'date_of_birth',
                  'phone_number', 'income', )


class UserCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('name', 'email', 'cpf', 'date_of_birth',
                  'phone_number', 'income', 'password', )
