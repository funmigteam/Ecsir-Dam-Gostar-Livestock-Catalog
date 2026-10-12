from django.db import migrations, models


class Migration(migrations.Migration):


    dependencies = [
        ("products", "0001_initial"),
    ]


    operations = [
        migrations.AddField(
            model_name="product",
            name="category",
            field=models.CharField(
                choices=[
                    ("vaccine", "واکسن"),
                    ("medicine", "دارو"),
                    ("canned", "کنسرو"),
                    ("food", "غذا"),
                ],
                default="food",
                max_length=20,
                verbose_name="دسته‌بندی",
            ),
        ),
    ]

