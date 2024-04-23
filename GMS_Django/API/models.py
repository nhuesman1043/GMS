from django.db import models

# Create your models here.
class Person(models.Model):
    person_id = models.BigAutoField(primary_key=True)
    first_name = models.CharField(max_length=255, null=False)
    last_name = models.CharField(max_length=255, null=False)
    date_of_birth = models.DateField(null=False)
    date_of_death = models.DateField(null=False)
    date_of_burial = models.DateField(null=False)
    obituary = models.TextField(null=False)
    portrait_image = models.ImageField()
    landscape_image = models.ImageField()

class Plot_Status(models.Model):
    status_id = models.BigAutoField(primary_key=True)
    status_name = models.CharField(max_length=50, null=False)
    color_hex = models.CharField(max_length=6, null=False)
    description = models.CharField(max_length=255)

class Plot(models.Model):
    plot_id = models.BigAutoField(primary_key=True)
    plot_latitude = models.DecimalField(null=False)
    plot_longitude = models.DecimalField(null=False)
    plot_state = models.ForeignKey(Plot_Status, on_delete=models.SET_NULL)
    person_id = models.ForeignKey(Person, on_delete=models.SET_NULL)