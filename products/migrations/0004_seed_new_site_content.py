from django.db import migrations


def create_missing_content(apps, schema_editor):

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
        ("products", "0003_sitecontent"),
    ]


    operations = [
        migrations.RunPython(create_missing_content, migrations.RunPython.noop),
    ]
