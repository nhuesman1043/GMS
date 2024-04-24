from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import Http404
from .models import Person, Plot_Status, Plot
from .serializers import Person_Serializer, Plot_Status_Serializer, Plot_Serializer

class Person_CRUD(APIView):
    def get(self, request, pk=None):
        if pk is not None:
            person = Person.objects.get(pk=pk)
            serializer = Person_Serializer(person)
            return Response(serializer.data)
    
        persons = Person.objects.all()
        serializer = Person_Serializer(persons, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = Person_Serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        person = self.get_object(pk)
        serializer = Person_Serializer(person, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        person = self.get_object(pk)
        person.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class Plot_Status_CRUD(APIView):
    def get(self, request, pk=None):
        if pk is not None:
            plot_status = Plot_Status.objects.get(pk=pk)
            serializer = Plot_Status_Serializer(plot_status)
            return Response(serializer.data)
    
        plot_statuses = Plot_Status.objects.all()
        serializer = Plot_Status_Serializer(plot_statuses, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = Plot_Status_Serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        plot_status = self.get_object(pk)
        serializer = Plot_Status_Serializer(plot_status, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        plot_status = self.get_object(pk)
        plot_status.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class Plot_CRUD(APIView):
    def get(self, request, pk=None):
        if pk is not None:
            plot = Plot.objects.get(pk=pk)
            serializer = Plot_Serializer(plot)
            return Response(serializer.data)
    
        plots = Plot.objects.all()
        serializer = Plot_Serializer(plots, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = Plot_Serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        plot = self.get_object(pk)
        serializer = Plot_Serializer(plot, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        plot = self.get_object(pk)
        plot.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)