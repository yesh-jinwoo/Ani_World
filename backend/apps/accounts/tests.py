from django.contrib.auth import get_user_model
from django.test import override_settings
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


@override_settings(ALLOWED_HOSTS=["testserver"])
class AuthenticationApiTests(APITestCase):
    def register(self, **overrides):
        payload = {
            "username": "hunter",
            "email": "hunter@example.com",
            "password": "A-strong-password-123",
            "confirm_password": "A-strong-password-123",
        }
        payload.update(overrides)
        return self.client.post(reverse("accounts:register"), payload, format="json")

    def test_registers_user_and_creates_session(self):
        response = self.register()
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["user"]["username"], "hunter")
        self.assertTrue(User.objects.filter(email="hunter@example.com").exists())

        current_user = self.client.get(reverse("accounts:me"))
        self.assertEqual(current_user.status_code, status.HTTP_200_OK)

    def test_rejects_duplicate_email(self):
        self.register()
        response = self.register(username="another-hunter")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_login_accepts_email_and_creates_session(self):
        User.objects.create_user("hunter", "hunter@example.com", "A-strong-password-123")
        response = self.client.post(reverse("accounts:login"), {
            "identifier": "hunter@example.com", "password": "A-strong-password-123", "remember_me": True,
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(self.client.get(reverse("accounts:me")).data["user"])

    def test_login_error_does_not_reveal_account_existence(self):
        response = self.client.post(reverse("accounts:login"), {
            "identifier": "missing@example.com", "password": "not-the-password",
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data["non_field_errors"][0], "Unable to sign in with those credentials.")

    def test_protected_route_rejects_anonymous_user(self):
        response = self.client.get(reverse("accounts:me"))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logout_invalidates_session(self):
        self.register()
        response = self.client.post(reverse("accounts:logout"), format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(self.client.get(reverse("accounts:me")).status_code, status.HTTP_403_FORBIDDEN)
