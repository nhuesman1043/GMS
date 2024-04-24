from django.urls import path
from . import views

urlpatterns = [
    # Person 
    path('persons/', views.Person_CRUD.as_view(), name='persons'),
    path('person/<int:pk>/', views.Person_CRUD.as_view(), name='person'),

    # Plot_Status
    path('plot_statuses/', views.Plot_Status_CRUD.as_view(), name='plot_statuses'),
    path('plot_status/<int:pk>/', views.Plot_Status_CRUD.as_view(), name='plot_status'),

    # Plot
    path('plots/', views.Plot_CRUD.as_view(), name='plots'),
    path('plot/<int:pk>/', views.Plot_CRUD.as_view(), name='plot'),
]