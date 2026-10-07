# EduTrack Student Portal

A simple, responsive student portal built with HTML, CSS, Vanilla JavaScript (ES6 modules), json-server, and Web Storage.

## Features

- **Register:** full name, email, student ID, and password, with validation (required fields, valid email, matching passwords, unique email and student ID).
- **Login:** checks credentials through the API and shows an error if they are wrong.
- **Remember Me:** the session is saved in `localStorage` when checked, or `sessionStorage` when unchecked.
- **Protected pages:** you can't open the dashboard without logging in.
- **Dashboard:** shows a welcome message, your profile, and your courses with teachers and scores.
- **Edit profile:** update your personal info.
- **Logout:** clears the session.

**Bonus**
- Password hashing (Web Crypto API)
- Show/Hide password
- Auto-logout after 30 minutes of inactivity

## How to Run

1. Clone the repo:
   ```bash
   git clone https://github.com/<your-username>/edutrack-student-portal.git
   cd edutrack-student-portal
   ```

2. Start json-server:
   ```bash
   npx json-server@0.17.4 --watch db.json --port 3000
   ```
   The API runs on `http://localhost:3000`.

3. Open `index.html` with **Live Server** in VS Code.

## Screenshots

![Register](screenshots/register.png)
![Login](screenshots/login.png)
![Dashboard](screenshots/dashboard.png)
