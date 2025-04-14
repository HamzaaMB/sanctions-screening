"""

Registers SanctionDecision model with Django admin interface
for CRUD access through the backend.

"""

from django.contrib import admin
from .models import SanctionDecision

admin.site.register(SanctionDecision)