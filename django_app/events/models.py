from django.db import models
from django.contrib.auth.models import User


class Event(models.Model):
	CATEGORY_IMAGES = {
		'Seminars': [
			'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
		],
		'Workshops': [
			'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80',
		],
		'Sports': [
			'https://images.unsplash.com/photo-1526232373132-0e4ee99d0de0?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80',
		],
		'Clubs': [
			'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?auto=format&fit=crop&w=1200&q=80',
		],
		'Networking': [
			'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1552581234-26160f608093?auto=format&fit=crop&w=1200&q=80',
		],
		'Tech': [
			'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
		],
		'Career': [
			'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
		],
		'Culture': [
			'https://images.unsplash.com/photo-1503428593586-e225b39bddfe?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
		],
	}
	DEFAULT_IMAGES = [
		'https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80',
		'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80',
		'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=80',
	]

	title = models.CharField(max_length=200)
	description = models.TextField()
	category = models.CharField(max_length=100)
	image_path = models.CharField(max_length=255, blank=True, default='')
	location = models.CharField(max_length=200)
	starts_at = models.DateTimeField()
	capacity = models.PositiveIntegerField(default=100)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['starts_at']

	def __str__(self):
		return self.title

	@property
	def spots_left(self):
		return max(self.capacity - self.registrations.count(), 0)

	@property
	def image_url(self):
		if self.image_path:
			clean_path = self.image_path.lstrip('/')
			if clean_path.startswith('static/'):
				return f'/{clean_path}'
			return f'/static/{clean_path}'

		pool = self.CATEGORY_IMAGES.get(self.category, self.DEFAULT_IMAGES)
		seed = self.pk if self.pk else sum(ord(char) for char in self.title)
		return pool[seed % len(pool)]


class Registration(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	event = models.ForeignKey(Event, related_name='registrations', on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		unique_together = ('user', 'event')
		ordering = ['-created_at']

	def __str__(self):
		return f'{self.user.username} -> {self.event.title}'


class Review(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	event = models.ForeignKey(Event, related_name='reviews', on_delete=models.CASCADE)
	body = models.TextField()
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		ordering = ['-created_at']

	def __str__(self):
		return f'{self.user.username} reviewed {self.event.title}'
