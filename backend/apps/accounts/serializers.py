from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db.models import Q
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """The safe subset of user information returned to the browser."""

    class Meta:
        model = User
        fields = ("id", "username", "email", "date_joined")
        read_only_fields = fields


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    confirm_password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("That username is already in use.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account already uses that email address.")
        return value.lower()

    def validate(self, attributes):
        if attributes["password"] != attributes["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        candidate = User(username=attributes["username"], email=attributes["email"])
        try:
            validate_password(attributes["password"], user=candidate)
        except DjangoValidationError as error:
            raise serializers.ValidationError({"password": error.messages}) from error
        return attributes

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(max_length=254)
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    remember_me = serializers.BooleanField(required=False, default=False)

    def validate(self, attributes):
        identifier = attributes["identifier"].strip()
        user = User.objects.filter(
            Q(username__iexact=identifier) | Q(email__iexact=identifier)
        ).order_by("id").first()
        authenticated_user = None
        if user:
            authenticated_user = authenticate(
                request=self.context.get("request"),
                username=user.get_username(),
                password=attributes["password"],
            )
        if authenticated_user is None:
            # Deliberately generic: it does not reveal whether an account exists.
            raise serializers.ValidationError("Unable to sign in with those credentials.")
        attributes["user"] = authenticated_user
        return attributes
