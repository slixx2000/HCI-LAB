from django.contrib import admin
from .models import Event, Registration, Review


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
	list_display = ('title', 'category', 'location', 'starts_at', 'capacity', 'image_path')
	search_fields = ('title', 'category', 'location', 'image_path')
	list_filter = ('category', 'starts_at')


@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
	list_display = ('user', 'event', 'created_at')
	search_fields = ('user__username', 'event__title')


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
	list_display = ('user', 'event', 'created_at')
	search_fields = ('user__username', 'event__title', 'body')
	list_filter = ('event', 'created_at')
