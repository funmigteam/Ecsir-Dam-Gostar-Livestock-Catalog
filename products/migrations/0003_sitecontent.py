from django.db import migrations, models


def create_default_content(apps, schema_editor):

    SiteContent = apps.get_model("products", "SiteContent")

    from products.site_content import SITE_CONTENT_DEFAULTS


    SiteContent.objects.bulk_create(
        [
            SiteContent(key=key, group=group, label=label, value=value)
            for key, (group, label, value) in SITE_CONTENT_DEFAULTS.items()
        ],
        ignore_conflicts=True,
    )


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0002_product_category"),
    ]


    operations = [
        migrations.CreateModel(
            name="SiteContent",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("key", models.SlugField(help_text="این مقدار توسط سایت استفاده می‌شود و بهتر است تغییر نکند.", max_length=100, unique=True, verbose_name="کلید")),
                ("label", models.CharField(max_length=160, verbose_name="عنوان در پنل")),
                ("group", models.CharField(max_length=80, verbose_name="بخش سایت")),
                ("value", models.TextField(blank=True, verbose_name="متن یا عدد")),
            ],
            options={
                "verbose_name": "محتوای سایت",
                "verbose_name_plural": "متن‌ها و شماره‌های سایت",
                "ordering": ["group", "label"],
            },
        ),
        migrations.RunPython(create_default_content, migrations.RunPython.noop),
    ]

