# Generated by Django 5.0.2 on 2024-04-25 00:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0004_alter_plot_person_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='person',
            name='landscape_image',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
        migrations.AlterField(
            model_name='person',
            name='portrait_image',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
    ]