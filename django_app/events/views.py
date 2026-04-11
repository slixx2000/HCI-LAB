from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.contrib.auth.views import LoginView
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST
from django.shortcuts import get_object_or_404, redirect, render

from .forms import CampusAuthenticationForm, ReviewForm, SignUpForm
from .models import Event, Registration, Review


def serialize_event(event):
	return {
		'id': event.id,
		'title': event.title,
		'description': event.description,
		'category': event.category,
		'location': event.location,
		'starts_at': event.starts_at.isoformat(),
		'capacity': event.capacity,
		'spots_left': event.spots_left,
		'registered_count': event.registrations.count(),
		'image_url': event.image_url,
		'detail_url': f'/events/{event.id}/',
	}


class CampusLoginView(LoginView):
	template_name = 'registration/login.html'
	authentication_form = CampusAuthenticationForm
	redirect_authenticated_user = True

	def form_valid(self, form):
		messages.success(self.request, 'Welcome back. You are now signed in.')
		return super().form_valid(form)

	def form_invalid(self, form):
		messages.error(self.request, 'Login failed. Check your username and password.')
		return super().form_invalid(form)


@require_POST
def logout_view(request):
	logout(request)
	messages.success(request, 'You have been signed out.')
	return redirect('home')


def home(request):
	selected_category = request.GET.get('category', 'All')
	categories = ['All', *Event.objects.order_by('category').values_list('category', flat=True).distinct()]
	if selected_category not in categories:
		selected_category = 'All'
	events = Event.objects.all()

	if selected_category != 'All':
		events = events.filter(category=selected_category)

	return render(request, 'events/home.html', {
		'events': events,
		'categories': categories,
		'selected_category': selected_category,
		'event_count': events.count(),
	})


def event_detail(request, event_id):
	event = get_object_or_404(Event, id=event_id)
	is_registered = False
	review_form = ReviewForm()
	reviews = event.reviews.select_related('user')

	if request.user.is_authenticated:
		is_registered = Registration.objects.filter(user=request.user, event=event).exists()

		if request.method == 'POST' and request.POST.get('review_submit'):
			review_form = ReviewForm(request.POST)
			if review_form.is_valid():
				Review.objects.create(
					user=request.user,
					event=event,
					body=review_form.cleaned_data['body'],
				)
				messages.success(request, 'Your review was posted.')
				return redirect('event_detail', event_id=event.id)
			messages.error(request, 'Please fix the review before posting.')

		elif request.method == 'POST' and not is_registered:
			if event.spots_left > 0:
				Registration.objects.create(user=request.user, event=event)
				messages.success(request, 'You are registered for this event.')
			else:
				messages.error(request, 'Sorry, this event is full.')
			return redirect('event_detail', event_id=event.id)
		elif request.method == 'POST' and is_registered:
			messages.info(request, 'You are already registered for this event.')
			return redirect('event_detail', event_id=event.id)

	context = {
		'event': event,
		'is_registered': is_registered,
		'review_form': review_form,
		'reviews': reviews,
	}
	return render(request, 'events/event_detail.html', context)


@require_GET
def reviews_page(request):
	reviews = Review.objects.select_related('event', 'user')
	return render(request, 'events/reviews.html', {'reviews': reviews})


def signup_view(request):
	if request.user.is_authenticated:
		return redirect('home')

	if request.method == 'POST':
		form = SignUpForm(request.POST)
		if form.is_valid():
			user = form.save()
			login(request, user)
			messages.success(request, 'Welcome! Your account was created.')
			return redirect('home')
		messages.error(request, 'Form submission failed. Check the highlighted fields and try again.')
	else:
		form = SignUpForm()

	return render(request, 'events/signup.html', {'form': form})


@login_required
def my_registrations(request):
	registrations = Registration.objects.filter(user=request.user).select_related('event')
	return render(request, 'events/my_registrations.html', {'registrations': registrations})


@require_GET
def api_events(request):
	events = Event.objects.all().prefetch_related('registrations')
	return JsonResponse({'results': [serialize_event(event) for event in events]})


@require_GET
def api_event_detail(request, event_id):
	event = get_object_or_404(Event.objects.prefetch_related('registrations'), id=event_id)
	return JsonResponse(serialize_event(event))


@ensure_csrf_cookie
@require_GET
def api_csrf(request):
	return JsonResponse({'csrfToken': get_token(request)})


@require_GET
def api_me(request):
	if not request.user.is_authenticated:
		return JsonResponse({'authenticated': False, 'user': None})

	return JsonResponse({
		'authenticated': True,
		'user': {
			'id': request.user.id,
			'username': request.user.username,
			'email': request.user.email,
		},
	})


@require_POST
def api_login(request):
	username = request.POST.get('username', '').strip()
	password = request.POST.get('password', '')

	user = authenticate(request, username=username, password=password)
	if user is None:
		return JsonResponse({'detail': 'Invalid username or password.'}, status=400)

	login(request, user)
	return JsonResponse({
		'authenticated': True,
		'user': {
			'id': user.id,
			'username': user.username,
			'email': user.email,
		},
	})


@require_POST
def api_logout(request):
	logout(request)
	return JsonResponse({'authenticated': False})


@require_POST
def api_register(request):
	username = request.POST.get('username', '').strip()
	email = request.POST.get('email', '').strip()
	password = request.POST.get('password', '')

	if not username or not password:
		return JsonResponse({'detail': 'Username and password are required.'}, status=400)

	if User.objects.filter(username=username).exists():
		return JsonResponse({'detail': 'That username is already taken.'}, status=400)

	try:
		user = User.objects.create_user(username=username, email=email, password=password)
	except ValidationError as error:
		return JsonResponse({'detail': error.messages[0]}, status=400)

	login(request, user)
	return JsonResponse({
		'authenticated': True,
		'user': {
			'id': user.id,
			'username': user.username,
			'email': user.email,
		},
	})


@require_POST
def api_register_event(request, event_id):
	if not request.user.is_authenticated:
		return JsonResponse({'detail': 'Authentication required.'}, status=401)

	event = get_object_or_404(Event.objects.prefetch_related('registrations'), id=event_id)

	if Registration.objects.filter(user=request.user, event=event).exists():
		return JsonResponse({'detail': 'You are already registered for this event.', 'event': serialize_event(event)}, status=400)

	if event.spots_left <= 0:
		return JsonResponse({'detail': 'This event is full.', 'event': serialize_event(event)}, status=400)

	Registration.objects.create(user=request.user, event=event)
	return JsonResponse({
		'detail': 'Registration saved.',
		'event': serialize_event(event),
	})
