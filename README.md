# Eventium - Campus Event Manager

This project is a local-first campus event management app built with Django.

It includes:
- Event browsing and registration
- User signup/login/logout
- Event reviews (publicly visible, posting requires login)
- Accessibility controls (theme, contrast, text size, bold text)
- Django admin management for events, registrations, and reviews

## Stack

- Python 3.10+
- Django 6
- SQLite (local database)
- Optional: React/Vite frontend in django_app/frontend

## Project Layout

```text
campus-events/
	django_app/
		manage.py
		db.sqlite3
		django_app/
		events/
		templates/
		static/
		frontend/    # optional React app
```

## Quick Setup

Run these commands from the repository root:

```bash
cd django_app
python3 -m pip install --user --break-system-packages django
python3 manage.py migrate
python3 manage.py check
```

## Run The App (Team Default)

Run the Django app on port 8000:

```bash
cd django_app
python3 manage.py runserver 0.0.0.0:8000
```

Open:
- http://127.0.0.1:8000/

## Admin Panel

Admin URL:
- http://127.0.0.1:8000/admin/

Dummy admin account for team demo:
- Username: admin
- Password: Admin123

The top navigation shows an Admin button only for signed-in admin users.

## Event Images

Event images are stored in:
- django_app/static/images/events/

Each event can use a local image path like:
- images/events/inclusive-leadership-seminar.jpg

Set this in Django admin under the Event image_path field.

## Optional Frontend (React)

If your team wants to run the React frontend as well:

```bash
cd django_app/frontend
npm install
npm run dev -- --host 0.0.0.0
```

Open:
- http://127.0.0.1:5173/

## Troubleshooting

### Port 8000 already in use

Find and stop the process using the port, then rerun:

```bash
ss -ltnp | grep :8000
```

### From the wrong folder manage.py is not found

Use:

```bash
python3 /absolute/path/to/django_app/manage.py runserver 0.0.0.0:8000
```

### Styles do not update after changes

Hard refresh the browser to clear cached CSS.
