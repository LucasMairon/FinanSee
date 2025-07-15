from django.core.validators import RegexValidator

name_regex_validator = RegexValidator(
    regex=r'^[a-zá-ùA-ZÁ-Ù]+((?:[\s][a-zá-ùA-ZÁ-Ù]+)?)+$',
    message="O nome deve conter apenas letras"
)

description_with_space_and_numbers_regex_validator = RegexValidator(
    regex=r'^[a-zá-ùA-ZÁ-Ù0-9]+((?:[\s][a-zá-ùA-ZÁ-Ù0-9]+)?)+([.]?)$',
    message="A descrição deve conter apenas letras e números"
)
