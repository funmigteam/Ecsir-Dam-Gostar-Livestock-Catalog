from django.db import OperationalError

from django.http import HttpResponse

from django.shortcuts import render

from django.urls import reverse


from .models import Product


def get_product_catalog():

    try:

        products_qs = Product.objects.filter(active=True).prefetch_related("features").order_by("order")

        if products_qs.exists():

            return [
                {
                    "title": product.title,
                    "subtitle": product.subtitle,
                    "description": product.description,
                    "category": product.category,
                    "category_label": product.get_category_display(),
                    "features": [feature.text for feature in product.features.all()],
                }
                for product in products_qs
            ]

    except OperationalError:

        pass


    return [
        {
            "title": "مکمل‌های غذایی دام",
            "category": "food",
            "category_label": "غذا",
            "subtitle": "محصولات تخصصی برای رشد سالم و افزایش کیفیت گوشت و شیر",
            "description": "ترکیبی از ویتامین‌ها، مواد معدنی و اسیدهای آمینه که نیازهای روزانه دام را تأمین می‌کند.",
            "features": [
                "فرمولاسیون مطابق با استانداردهای بین‌المللی",
                "تقویت سیستم ایمنی بدن",
                "بهبود کیفیت محصولات دامی",
            ],
        },
        {
            "title": "داروهای دامپزشکی",
            "category": "medicine",
            "category_label": "دارو",
            "subtitle": "حفاظت دقیق و مطمئن از سلامت گله",
            "description": "محصولاتی با فرمول‌های پیشرفته برای درمان و پیشگیری عفونت‌ها و مشکلات متابولیکی.",
            "features": [
                "بدون جانشین بودن در بازار داخلی",
                "پشتیبانی علمی و مستندات کامل",
                "مناسب برای گاو، گوسفند، بز و طیور",
            ],
        },
        {
            "title": "تجهیزات مرغداری",
            "category": "food",
            "category_label": "غذا",
            "subtitle": "راهکارهایی برای افزایش راندمان فارم‌های مرغداری",
            "description": "وسیله‌هایی برای تغذیه، آب‌رسانی و نگهداری استاندارد مرغ‌ها با طراحی مدرن.",
            "features": [
                "ساختار ساده و عملیاتی آسان",
                "دوام بالا و سازگار با محیط زیست",
                "کاهش هدررفت و بهینه‌سازی مصرف منابع",
            ],
        },
        {
            "title": "خوراک صنعتی دام",
            "category": "food",
            "category_label": "غذا",
            "subtitle": "تأمین انرژی و پروتئین مورد نیاز گله با کیفیت بالا",
            "description": "خوراک‌های تولید شده با مواد اولیه مرغوب و فرمول‌های تخصصی برای هر نوع دام.",
            "features": [
                "بهبود رشد و بازدهی",
                "کنترل دقیق کیفیت در تمام مراحل تولید",
                "تنوع فرمول برای نیازهای مختلف گله",
            ],
        },
        {
            "title": "محصولات ضد انگل و بهداشتی",
            "category": "medicine",
            "category_label": "دارو",
            "subtitle": "محافظت کامل از گله در برابر انگل‌ها و بیماری‌های شایع",
            "description": "راهکارهایی برای پیشگیری و درمان با کمترین عوارض جانبی و بیشترین اثربخشی.",
            "features": [
                "فرمولاسیون ایمن برای تمامی دام‌ها",
                "راحتی استفاده و نتایج سریع",
                "پشتیبانی علمی برای دامپزشکان",
            ],
        },
        {
            "title": "افزودنی‌های خوراکی تخصصی",
            "category": "food",
            "category_label": "غذا",
            "subtitle": "تقویت عملکرد تولید و بهبود کیفیت محصولات دامی",
            "description": "آفزونه‌هایی که به ارائه عملکرد بهتر، کاهش هزینه‌ها و بهبود سلامت گله کمک می‌کنند.",
            "features": [
                "کاهش افت کیفیت و افزایش راندمان",
                "سازگار با فرمولاسیون‌های مختلف خوراک",
                "بهبود وضعیت گوارشی و جذب مواد مغذی",
            ],
        },
        {
            "title": "تجهیزات نگهداری و کنترل آب",
            "category": "canned",
            "category_label": "کنسرو",
            "subtitle": "سیستم‌هایی با دوام و دقت بالا برای تأمین آب سالم",
            "description": "تجهیزاتی برای مدیریت مصرف آب و تضمین شرایط مناسب نگهداری دام و طیور.",
            "features": [
                "کنترل خودکار جریان و فشار آب",
                "ساختار مقاوم و مقاوم در برابر خوردگی",
                "نصب و نگهداری آسان",
            ],
        },
        {
            "title": "محصولات تخصصی طیور",
            "category": "vaccine",
            "category_label": "واکسن",
            "subtitle": "راهکارهایی برای سلامت و تولید بهتر در فارم‌های مرغداری",
            "description": "محصولاتی اختصاصی برای رشد سالم، افزایش تخم‌دهی و کاهش بیماری‌های طیور.",
            "features": [
                "کنترل شرایط محیطی و تغذیه‌ای",
                "کاهش استرس و افزایش بازدهی",
                "مواد اولیه مرغوب با فرمولاسیون تخصصی",
            ],
        },
    ]


CATEGORY_ORDER = ("vaccine", "medicine", "canned", "food")


def get_category_cards(products):

    counts = {key: 0 for key in CATEGORY_ORDER}

    for product in products:

        if product["category"] in counts:

            counts[product["category"]] += 1

    labels = dict(Product.Category.choices)

    return [
        {"key": key, "label": labels[key], "count": counts[key]}
        for key in CATEGORY_ORDER
    ]


def home_view(request):

    products = get_product_catalog()

    return render(
        request,
        "products/index.html",
        {"categories": get_category_cards(products), "product_total": len(products)},
    )


def products_view(request):

    products = get_product_catalog()

    return render(
        request,
        "products/all_products.html",
        {"products": products, "categories": get_category_cards(products)},
    )


def robots_txt(request):

    lines = [
        "User-agent: *",
        "Disallow: /admin/",
        f"Sitemap: {request.build_absolute_uri(reverse('sitemap'))}",
    ]

    return HttpResponse("\n".join(lines) + "\n", content_type="text/plain; charset=utf-8")


def sitemap_xml(request):

    urls = "".join(
        f"<url><loc>{request.build_absolute_uri(reverse(name))}</loc></url>"
        for name in ("home", "products")
    )

    body = (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        f"{urls}</urlset>"
    )

    return HttpResponse(body, content_type="application/xml; charset=utf-8")
