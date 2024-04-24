from rest_framework import serializers
from .models import Person, Plot_Status, Plot

class Person_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

class Plot_Status_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Plot_Status
        fields = '__all__'

class Plot_Serializer(serializers.ModelSerializer):
    class Meta:
        model = Plot
        fields = '__all__'
