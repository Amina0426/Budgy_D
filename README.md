# Budgy

Budgy is a Django-based personal finance tracker with user authentication, REST API-backed expense and income management, budget tracking, and a browser-based front end.

## 1. Project Structure

- `manage.py` - Django CLI entry point.
- `budgy_project/` - main Django project settings and root URL configuration.
- `budgy_app/` - single Django app containing models, views, serializers, URLs, templates, static assets, and admin registration.
- `media/` - uploaded expense images.
- `db.sqlite3` - SQLite database.
- `venv/` - local Python virtual environment.

## 2. App Modules Present

- `models.py` - `Expenses`, `Incomes`, `Budget` models.
- `views.py` - login/signup/logout pages, React-style REST viewsets for income/expense/budget, and reset endpoint.
- `serializers.py` - DRF serializers for API input/output.
- `urls.py` - application route definitions and API router.
- `templates/budgy_app/` - HTML templates for main UI and auth pages.
- `static/` - CSS, JavaScript, PWA manifest, service worker, icons.
- `admin.py` - registers models with Django admin.

## 3. Frontend vs Backend Separation

- Backend: Django + Django REST Framework handles user auth, database models, and JSON API endpoints.
- Frontend: static HTML/CSS/JS in `budgy_app/templates` and `budgy_app/static`; uses fetch/XHR calls to REST endpoints.
- The `index.html` template is server-rendered with user context, while client-side JS uses REST API endpoints to manage data.

## 4. Database Models

- `Expenses`:
  - `user` (ForeignKey to Django user)
  - `amount` (float)
  - `tag` (string)
  - `date` (auto now add)
  - `img` (optional uploaded image)
- `Incomes`:
  - `user`
  - `amount`
  - `date`
- `Budget`:
  - `user`
  - `amount`
  - `created_at`

## 5. Templates and Static File Usage

- `index.html` is the main single-page UI for budget, income, expense, reports, settings, and image preview.
- `login.html` and `signup.html` are simple authentication pages.
- Static CSS files style the interface and responsive layout.
- Static JS implements navigation, expense/income CRUD, filters, budget tracking, image upload, modal controls, theme toggle, and PWA service worker registration.
- `service-worker.js` and `manifest.json` enable basic offline/PWA caching.

## 6. Routes and Views

- `''` → `index_page` protected by login.
- `login/`, `signup/`, `logout/` → auth views.
- `api/incomes/`, `api/expenses/`, `api/budgets/` → DRF viewsets.
- `api/reset/` → custom DELETE endpoint for clearing data.

## 7. Incomplete Integrations

- `reset` endpoint deletes only `Expenses` and `Incomes`, not user budgets.
- `downloadData()` in `settings.js` has a broken `method` variable and will fail when exporting data.
- Budget persistence is only read from the first returned budget record; there is no enforcement of a single budget object per user.
- `edit` modal opens correctly, but edit form inputs are not pre-populated with the current item values.
- The app relies on GET/POST/PATCH to authenticated endpoints, but CSRF protection may be incomplete for the REST API if cookies are not set correctly.
- `signup_view` does not log in the user automatically after account creation.

## 8. Likely Next Development Steps

- fix `downloadData()` to use `GET` and export both budgets and incomes as expected.
- make `api/reset/` user-scoped or include budgets in reset behavior.
- improve budget model handling so each user has one active monthly budget.
- add tests for auth flows, API CRUD operations, and budget calculations.
- prefill edit dialogs for income/expense update operations.
- add proper error handling for missing auth and expired sessions.

## 9. Potential Logic Bugs

- `reset` is not user-scoped and can erase all users’ expense/income data.
- `downloadData()` uses an undefined `method` variable.
- `Budget` data is read from `budgets[0]` only and may ignore additional budget items.
- The frontend edit form does not preload current values, which can lead to accidental data overwrite.
- The app does not delete uploaded expense images when expense rows are removed.

## Features

- User signup/login/logout.
- Authenticated expense and income tracking.
- Tag-based expense entries and image attachment for receipts.
- Budget tracking with used/remaining indicators.
- Monthly and past expense grouping.
- Theme toggle and PWA service worker support.
- Data export and reset controls.

---

### Run locally

1. Activate your virtual environment.
2. Install dependencies: `pip install django djangorestframework`.
3. Run migrations: `python manage.py migrate`.
4. Start server: `python manage.py runserver`.
5. Visit `http://127.0.0.1:8000/`.
