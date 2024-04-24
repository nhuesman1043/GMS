from django.contrib import admin
from API.models import Person, Plot, Plot_Status

admin.site.register(Person)
admin.site.register(Plot)
admin.site.register(Plot_Status)