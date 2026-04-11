from django.urls import path

from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('events/<int:event_id>/', views.event_detail, name='event_detail'),
    path('reviews/', views.reviews_page, name='reviews'),
    path('register/', views.signup_view, name='signup'),
    path('my-registrations/', views.my_registrations, name='my_registrations'),
    path('api/events/', views.api_events, name='api_events'),
    path('api/events/<int:event_id>/', views.api_event_detail, name='api_event_detail'),
    path('api/events/<int:event_id>/register/', views.api_register_event, name='api_register_event'),
    path('api/csrf/', views.api_csrf, name='api_csrf'),
    path('api/me/', views.api_me, name='api_me'),
    path('api/auth/login/', views.api_login, name='api_login'),
    path('api/auth/logout/', views.api_logout, name='api_logout'),
    path('api/auth/register/', views.api_register, name='api_register'),
]
