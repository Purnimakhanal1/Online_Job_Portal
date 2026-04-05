# Online Job Portal

A simple job portal built with static frontend pages, a PHP backend, and PostgreSQL. This version is meant to run locally on Apache/XAMPP and stores uploaded files on the local filesystem.It supports job seekers, employers, and admins. Users can register, log in, browse jobs, apply for jobs,
manage profiles, and administer platform data through backend APIs and database tables.

It supports three roles:

- `job_seeker` can browse jobs and apply
- `employer` can post jobs and manage applications
- `admin` can view platform stats, review all users, and moderate jobs

## Stack

- HTML, CSS, Bootstrap, vanilla JavaScript
- PHP
- PostgreSQL
- Apache/XAMPP
- Local file uploads in `backend/uploads/`

## Project Structure

```text
OnlineWebPortal/
├── frontend/              # HTML pages
├── assets/                # CSS, JS, images, icons
├── backend/               # PHP API endpoints, config, logs, uploads
│   ├── auth/
│   ├── admin/
│   ├── jobs/
│   ├── applications/
│   ├── users/
│   ├── config/
│   ├── uploads/
│   └── logs/
├── database/
│   └── job_portal.sql
├── README.md
└── PROJECT_DOCUMENTATION.md
```

## Local Setup

1. Place the project inside `C:\xampp\htdocs\OnlineWebPortal`.
2. Enable `pdo_pgsql` and `pgsql` in XAMPP PHP.
3. Create a PostgreSQL database named `job_portal`.
4. Import [job_portal.sql](/d:/OnlineWebPortal/database/job_portal.sql).
5. Update the database settings in [db.php](/d:/OnlineWebPortal/backend/config/db.php) if your local PostgreSQL username or password is different.
6. Start Apache from XAMPP.
7. Open `http://localhost/OnlineWebPortal/frontend/index.html`.

## Demo Accounts

- `admin@example.com` / `Pass@1234`
- `employer@example.com` / `Pass@1234`
- `jobseeker@example.com` / `Pass@1234`

## Notes

- Uploaded resumes, profile pictures, and logos are stored under `backend/uploads/`.
- Database settings are currently configured directly in [db.php](/d:/OnlineWebPortal/backend/config/db.php).
- The main database schema and sample data are in [job_portal.sql](/d:/OnlineWebPortal/database/job_portal.sql).

## License

MIT. See `LICENSE`.
