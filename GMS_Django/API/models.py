from django.db import models
from django.core.validators import RegexValidator
from django.db.models import UniqueConstraint

class Person(models.Model):
    person_id = models.BigAutoField(primary_key=True)
    first_name = models.CharField(max_length=255, null=False)
    last_name = models.CharField(max_length=255, null=False)
    date_of_birth = models.DateField(null=False)
    date_of_death = models.DateField(null=False)
    date_of_burial = models.DateField(null=False)
    obituary = models.TextField(null=False)
    portrait_image = models.ImageField(null=True, blank=True, upload_to='API/images/')
    landscape_image = models.ImageField(null=True, blank=True, upload_to='API/images/')

    def __str__(self):
        return (self.first_name + " " + self.last_name)

class Plot_Status(models.Model):
    status_id = models.BigAutoField(primary_key=True)
    status_name = models.CharField(max_length=50, null=False)
    # Validate that color_hex is a valid hex color code
    color_hex_validator = RegexValidator(
        regex=r'^#[0-9A-Fa-f]{6}$',
        message="Enter a valid hex color code, including the '#' prefix, consisting of 6 digits (0-9, A-F)."
    )
    color_hex = models.CharField(
        max_length=7, 
        null=False, 
        validators=[color_hex_validator]
    )
    description = models.CharField(max_length=255)

    def __str__(self):
        return self.status_name

class Plot(models.Model):
    plot_id = models.BigAutoField(primary_key=True)
    plot_identifier = models.CharField(max_length=50, default=None, unique=True)
    plot_latitude = models.DecimalField(null=False, decimal_places=8, max_digits=12)
    plot_longitude = models.DecimalField(null=False, decimal_places=8, max_digits=12)
    plot_state = models.ForeignKey(Plot_Status, on_delete=models.SET_NULL, null=True)
    person_id = models.OneToOneField(Person, on_delete=models.SET_NULL, null=True, blank=True, unique=True)

    def __str__(self):
        return (self.plot_identifier + " - " + str(self.plot_latitude) + "/" + str(self.plot_longitude))
    
    # Ensure we have unique locations for each plot
    class Meta:
        constraints = [
            UniqueConstraint(fields=['plot_latitude', 'plot_longitude'], name='unique_plot_location')
        ]