from django.db import OperationalError, ProgrammingError


from .models import SiteContent

from .site_content import SITE_CONTENT_DEFAULTS


def site_content(request):

    content = {
        key: default
        for key, (_group, _label, default) in SITE_CONTENT_DEFAULTS.items()
    }


    try:

        content.update(dict(SiteContent.objects.values_list("key", "value")))

    except (OperationalError, ProgrammingError):

        pass


    return {"site_content": content}

