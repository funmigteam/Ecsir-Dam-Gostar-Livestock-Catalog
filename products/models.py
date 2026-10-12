from django.db import models


class Product(models.Model):

    class Category(models.TextChoices):

        VACCINE = "vaccine", "واکسن"

        MEDICINE = "medicine", "دارو"

        CANNED = "canned", "کنسرو"

        FOOD = "food", "غذا"


    title = models.CharField(max_length=220)

    subtitle = models.CharField(max_length=260, blank=True)

    description = models.TextField(blank=True)

    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.FOOD,
        verbose_name="دسته‌بندی",
    )

    order = models.PositiveIntegerField(default=0)

    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)


    class Meta:

        ordering = ["order", "title"]

        verbose_name = "محصول"

        verbose_name_plural = "محصولات"


    def __str__(self):

        return self.title


class ProductFeature(models.Model):

    product = models.ForeignKey(Product, related_name="features", on_delete=models.CASCADE)

    text = models.CharField(max_length=220)

    order = models.PositiveIntegerField(default=0)


    class Meta:

        ordering = ["order"]

        verbose_name = "ویژگی محصول"

        verbose_name_plural = "ویژگی‌های محصول"


    def __str__(self):

        return self.text


class SiteContent(models.Model):

    key = models.SlugField(
        max_length=100,
        unique=True,
        verbose_name="کلید",
        help_text="این مقدار توسط سایت استفاده می‌شود و بهتر است تغییر نکند.",
    )

    label = models.CharField(max_length=160, verbose_name="عنوان در پنل")

    group = models.CharField(max_length=80, verbose_name="بخش سایت")

    value = models.TextField(blank=True, verbose_name="متن یا عدد")


    class Meta:

        ordering = ["group", "label"]

        verbose_name = "محتوای سایت"

        verbose_name_plural = "متن‌ها و شماره‌های سایت"


    def __str__(self):

        return self.label

