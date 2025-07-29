import uuid
from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.core.mail import send_mail
from django.utils import timezone
from django.core.validators import MinLengthValidator, MinValueValidator
from .managers import CustomUserManager
from .validators import (
    cpf_regex_validator,
    email_regex_validator,
    legal_age_validator,
    name_regex_validator,
    phone_number_regex_validator,
    valid_cpf_validator,
)


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )
    name = models.CharField(
        _("name"),
        max_length=150,
        validators=[MinLengthValidator(2), name_regex_validator]
    )
    email = models.EmailField(
        _("email address"),
        validators=[email_regex_validator],
        unique=True
    )
    cpf = models.CharField(
        _("CPF"),
        max_length=11,
        validators=[
            valid_cpf_validator,
            cpf_regex_validator,
            MinLengthValidator(11)
        ],
        unique=True,
        null=True,
    )
    date_of_birth = models.DateField(
        _("date of birth"),
        validators=[legal_age_validator],
        null=True,
    )
    phone_number = models.CharField(
        _("phone number"),
        max_length=11,
        validators=[phone_number_regex_validator, MinLengthValidator(11)],
        unique=True,
        null=True,
    )
    income = models.DecimalField(
        _("income"),
        max_digits=10,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0)],
    )
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_(
            "Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )
    date_joined = models.DateTimeField(_("date joined"), default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['name', 'cpf', 'date_of_birth',
                       'phone_number', 'income']

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def email_user(self, subject, message, from_email=None, **kwargs):
        """Send an email to this user."""
        send_mail(subject, message, from_email, [self.email], **kwargs)

    def __str__(self):
        return str(self.email)
