from django.db import migrations, models


class Migration(migrations.Migration):


    initial = True


    dependencies = []


    operations = [
        migrations.CreateModel(
            name="Product",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=220)),
                ("subtitle", models.CharField(blank=True, max_length=260)),
                ("description", models.TextField(blank=True)),
                ("order", models.PositiveIntegerField(default=0)),
                ("active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["order", "title"],
                "verbose_name": "محصول",
                "verbose_name_plural": "محصولات",
            },
        ),
        migrations.CreateModel(
            name="ProductFeature",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("text", models.CharField(max_length=220)),
                ("order", models.PositiveIntegerField(default=0)),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=models.deletion.CASCADE,
                        related_name="features",
                        to="products.product",
                    ),
                ),
            ],
            options={
                "ordering": ["order"],
                "verbose_name": "ویژگی محصول",
                "verbose_name_plural": "ویژگی‌های محصول",
            },
        ),
    ]

