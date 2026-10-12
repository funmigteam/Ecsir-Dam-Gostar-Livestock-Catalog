from django.contrib import admin

from .models import Product, ProductFeature, SiteContent


class ProductFeatureInline(admin.TabularInline):

    model = ProductFeature

    extra = 3

    min_num = 1

    verbose_name = "ویژگی"

    verbose_name_plural = "ویژگی‌ها"


@admin.register(Product)

class ProductAdmin(admin.ModelAdmin):

    list_display = ("title", "category", "subtitle", "active", "order")

    list_editable = ("active", "order")

    list_filter = ("category", "active")

    search_fields = ("title", "subtitle", "description", "features__text")

    inlines = (ProductFeatureInline,)

    fieldsets = (
        (None, {
            "fields": ("title", "category", "subtitle", "description", "active", "order"),
        }),
    )


@admin.register(ProductFeature)

class ProductFeatureAdmin(admin.ModelAdmin):

    list_display = ("text", "product", "order")

    list_filter = ("product",)

    search_fields = ("text",)


@admin.register(SiteContent)

class SiteContentAdmin(admin.ModelAdmin):

    list_display = ("label", "group", "value_preview", "key")

    list_filter = ("group",)

    search_fields = ("label", "value", "key")

    readonly_fields = ("key", "label", "group")

    ordering = ("group", "label")


    @admin.display(description="مقدار فعلی")

    def value_preview(self, obj):

        return obj.value[:80]

