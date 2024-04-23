from django.contrib import admin
from API.models import Person, Plot, Plot_Status

# Register your models here.
admin.site.register(Person)
admin.site.register(Plot)
admin.site.register(Plot_Status)