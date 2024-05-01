from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Person, Plot_Status, Plot
from .serializers import Person_Serializer, Plot_Status_Serializer, Plot_Serializer
from django.http import FileResponse
from django.conf import settings
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from django.core.mail import send_mail
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
import os
import json

def password_reset(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        user = get_object_or_404(User, email=email)

        # Generate and save a unique token for password reset
        token = get_random_string(length=32)
        user.profile.password_reset_token = token
        user.profile.save()

        # Send password reset email
        reset_link = f'http://localhost:4200/reset-password/'
        print('Helllooooooo')
        send_mail(
            'Password Reset',
            f'Click the following link to reset your password: {reset_link}',
            'from@example.com',
            [email],
            fail_silently=False,
        )
        
        return JsonResponse({'message': 'Password reset email sent'}, status=200)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            print(request)
            print(token)
            return JsonResponse({'success': True, 'message': 'Login successful', 'token': token.key})
        else:
            return JsonResponse({'success': False, 'error': 'Invalid username or password'}, status=401)
    else:
        return JsonResponse({'success': False, 'error': 'Invalid request method'}, status=400)

def logout_view(request):
    # Clear any session data specific to the "sexton" role
    if 'sexton_role' in request.session:
        del request.session['sexton_role']
    
    print(request)
    print('Logging out')
    logout(request) 

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
        person = Person.objects.get(pk=pk)
        serializer = Person_Serializer(person, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        person = Person.objects.get(pk=pk)
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
        plot_status = Plot_Status.objects.get(pk=pk)
        serializer = Plot_Status_Serializer(plot_status, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        plot_status = Plot_Status.objects.get(pk=pk)
        plot_status.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
def serve_image(request, image_path):
    # Construct the full path to the image file
    full_path = os.path.join(settings.MEDIA_ROOT, image_path)
    
    # Serve the image file using FileResponse
    return FileResponse(open(full_path, 'rb'), content_type='image/jpeg')

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
        plot = Plot.objects.get(pk=pk)
        serializer = Plot_Serializer(plot, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        plot = Plot.objects.get(pk=pk)
        plot.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)