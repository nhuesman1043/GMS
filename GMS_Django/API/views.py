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
import os
import json
from django.core.files.storage import FileSystemStorage
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes
from PIL import Image
from mimetypes import guess_type

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
            instance = serializer.save()
            # Include person_id in the serialized data
            serialized_data = serializer.data
            serialized_data['person_id'] = instance.person_id
            return Response(serialized_data, status=status.HTTP_201_CREATED)
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
    try:
        # Construct the full path to the image file
        full_path = os.path.join(settings.MEDIA_ROOT, image_path)

        # Determine the content type dynamically
        content_type, _ = guess_type(full_path)
        if not content_type:
            content_type = 'application/octet-stream'  # Default to binary data if content type cannot be determined

        # Serve the image file using FileResponse with the determined content type
        return FileResponse(open(full_path, 'rb'), content_type=content_type)
    except FileNotFoundError:
        return JsonResponse({'error': 'Image not found'}, status=404)

@csrf_exempt
@parser_classes([MultiPartParser, FormParser])
def upload_image(request):
    if request.method == 'POST' and request.FILES.get('image'):
        image = request.FILES['image']

        # Check if the uploaded file is an image
        try:
            img = Image.open(image)
            img.verify()  # Verify that it's an image
        except Exception as e:
            return JsonResponse({'error': 'Uploaded file is not a valid image'}, status=400)

        # Save the image to MEDIA_ROOT
        fs = FileSystemStorage(location=settings.MEDIA_ROOT)
        fileName = fs.save(image.name, image)

        # You can save the filename to a model or return it in the response
        return JsonResponse({'message': 'Image uploaded successfully', 'fileName': fileName}, status=200)
    else:
        return JsonResponse({'error': 'No image provided or incorrect request method'}, status=400)

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