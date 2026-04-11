from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.models import User


class SignUpForm(UserCreationForm):
    email = forms.EmailField(required=True)

    def clean_email(self):
        email = self.cleaned_data['email'].strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError('That email address is already in use.')
        return email

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')
        widgets = {
            'username': forms.TextInput(attrs={
                'placeholder': 'Choose a username',
                'autocomplete': 'username',
                'autofocus': True,
            }),
            'email': forms.EmailInput(attrs={
                'placeholder': 'name@example.com',
                'autocomplete': 'email',
            }),
            'password1': forms.PasswordInput(attrs={
                'placeholder': 'Create a password',
                'autocomplete': 'new-password',
            }),
            'password2': forms.PasswordInput(attrs={
                'placeholder': 'Confirm your password',
                'autocomplete': 'new-password',
            }),
        }
        help_texts = {
            'username': 'Pick a short public name for your campus profile.',
            'email': 'We only use this for account verification and messages.',
        }


class CampusAuthenticationForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={
        'placeholder': 'Enter your username',
        'autocomplete': 'username',
        'autofocus': True,
    }))
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'placeholder': 'Enter your password',
        'autocomplete': 'current-password',
    }))


class ReviewForm(forms.Form):
    body = forms.CharField(
        label='Leave a review',
        widget=forms.Textarea(attrs={
            'placeholder': 'Share what you thought about this event...',
            'rows': 4,
        }),
        max_length=800,
    )

    def clean_body(self):
        body = self.cleaned_data['body'].strip()
        if not body:
            raise forms.ValidationError('Please write a review before submitting.')
        return body
