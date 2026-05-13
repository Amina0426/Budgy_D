# Budgy

[![Django](https://img.shields.io/badge/Django-4.x-green)](https://www.djangoproject.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow)](https://developer.mozilla.org/docs/Web/JavaScript)
[![Render](https://img.shields.io/badge/Render-Hosted-blue)](https://render.com/)
[![PWA](https://img.shields.io/badge/PWA-Offline-blueviolet)](https://web.dev/progressive-web-apps/)

**Budgy** is a modern full-stack expense tracker built with Django, Django REST Framework, and vanilla JavaScript. It offers secure authentication, financial summaries, budget management, receipt uploads, and offline support with PWA capabilities.

[Live Demo](https://budgy-q39z.onrender.com)

---

## Overview

Budgy helps users manage personal finances through an intuitive web interface. Users can:

- Track incomes and expenses
- Set and monitor monthly budgets
- View balance and spending summaries
- Categorize transactions by tag
- Upload expense receipts and images
- Use the app offline with service worker caching
- Register securely and manage user-specific data

## Features

- ✅ User authentication (signup, login, logout)
- ✅ Income and expense CRUD operations
- ✅ Monthly budget creation and balance overview
- ✅ Expense categorization and receipt uploads
- ✅ Responsive desktop/mobile UI with HTML/CSS/JS
- ✅ Progressive Web App (PWA) support
- ✅ Offline caching via service worker
- ✅ REST API endpoints with Django REST Framework
- ✅ SQLite backend for easy local setup
- ✅ Hosted deployment on Render

## Tech Stack

- Django
- Django REST Framework
- Vanilla JavaScript
- HTML / CSS
- SQLite
- Progressive Web App (PWA)
- Render

## Screenshots

> Add real screenshots here once available.

- Dashboard and summary view
- Add expense / upload receipt screen
- Budget and history views

## PWA & Offline Support

Budgy includes a PWA manifest and a service worker to enable offline capability and installable behavior. This improves load performance and provides a better mobile experience.

## API Overview

The app exposes REST endpoints for client-side data management.

- `api/incomes/` — manage income records
- `api/expenses/` — manage expense records
- `api/budgets/` — manage budgets
- `api/reset/` — reset expense and income data

Authentication is required for protected endpoints.

## Deployment

Budgy is deployed on Render. The deployed version uses Django static file handling and service worker registration for PWA support.

- Live demo: [LINK](https://budgy-q39z.onrender.com)

## Future Improvements

- Add automated tests for authentication and API endpoints
- Add charts and visual financial analytics
- Enhance receipt image management and cleanup
- Support data import/export for user financial history

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your updates: `git commit -m "Add feature"`
5. Push to your branch: `git push origin feature-name`
6. Open a pull request

Please keep contributions focused and well documented.

## Notes

The repository contains a complete Django app with authentication, REST APIs, responsive UI, media uploads, and PWA offline support. It is ready for local development and Render deployment.
