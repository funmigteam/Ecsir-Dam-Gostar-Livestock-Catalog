from django.urls import path

from . import views


urlpatterns = [
    path("", views.home_view, name="home"),
    path("products/", views.products_view, name="products"),
    path("robots.txt", views.robots_txt, name="robots"),
    path("sitemap.xml", views.sitemap_xml, name="sitemap"),
]

