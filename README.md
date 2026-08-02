# AniWorld

AniWorld is a learning-focused, full-stack anime platform with an original dark-fantasy visual identity. It uses vanilla HTML, CSS, and JavaScript in the browser, with a Django REST API and PostgreSQL database.

## Architecture

```text
Browser (HTML/CSS/JavaScript) → Django REST API → PostgreSQL
```

The frontend sends HTTP requests to the API. Django validates requests, applies authentication and authorization rules, and uses its ORM to read and write PostgreSQL data.

## Technology stack

- Frontend: HTML5, CSS3, vanilla JavaScript, Fetch API
- Backend: Python, Django, Django REST Framework
- Database: PostgreSQL
- Authentication: Django server-side sessions and HttpOnly cookies

## Current status

Phase 3 is in progress: session-based registration, login, logout, and current-user API endpoints are implemented. PostgreSQL must be running before migrations and full authentication tests can run.

## Local setup

1. Install Python 3.13+, Git, and PostgreSQL 16+.
2. Create and activate the virtual environment:

   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```

3. Copy `.env.example` to `.env`, then set a strong local `DJANGO_SECRET_KEY` and database password.
4. Create the PostgreSQL role and database described in the Environment variables section.
5. Run migrations after PostgreSQL is available:

   ```powershell
   cd backend
   ..\.venv\Scripts\python.exe manage.py migrate
   ```

6. Start Django:

   ```powershell
   ..\.venv\Scripts\python.exe manage.py runserver
   ```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DJANGO_SECRET_KEY` | cryptographic signing key; keep private |
| `DJANGO_DEBUG` | development debugging flag; must be `False` in production |
| `DJANGO_ALLOWED_HOSTS` | comma-separated allowed hostnames |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | allowed browser origins for state-changing requests |
| `POSTGRES_*` | PostgreSQL connection settings |

## Authentication API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/auth/csrf/` | sets the CSRF cookie for secure browser requests |
| `POST` | `/api/auth/register/` | creates a user and starts a session |
| `POST` | `/api/auth/login/` | signs in by username or email |
| `POST` | `/api/auth/logout/` | invalidates the current session |
| `GET` | `/api/auth/me/` | returns the authenticated user; protected |

The API uses Django server-side sessions. The browser sends its HttpOnly session cookie automatically, while JavaScript sends the separate CSRF token for state-changing requests.

## Viewing locally

Start the backend in one terminal:

```powershell
cd backend
..\.venv\Scripts\python.exe manage.py runserver
```

Start the frontend in a second terminal:

```powershell
cd frontend
..\.venv\Scripts\python.exe -m http.server 5500
```

Open `http://127.0.0.1:5500`. Authentication requires PostgreSQL migrations to have been run first.

## Git workflow

Use `main` for stable milestones, `develop` for integrated development, and focused `feature/*` branches. Before committing, inspect changes with `git status` and `git diff`. We use Conventional Commits, for example: `feat: initialize AniWorld Django backend`.

## Security notes

- `.env` is ignored and must never be committed.
- Django stores password hashes, never plaintext passwords.
- Browser authentication will use HttpOnly session cookies.
- PostgreSQL credentials remain server-side only.

## Roadmap

Landing page → authentication → authentication UX → Google OAuth → anime catalog → user features → dashboard → admin → security review → tests → real-time feature → deployment.
