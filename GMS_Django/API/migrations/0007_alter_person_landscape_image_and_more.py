# Generated by Django 5.0.2 on 2024-04-26 00:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('API', '0006_alter_person_landscape_image_and_more'),
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