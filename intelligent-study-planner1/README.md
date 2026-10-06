# Intelligent Study Planner & Progress Tracker

A complete beginner-friendly college mini-project based on the supplied requirements. It uses a free/open-source-first stack and has a working rule-based AI fallback, so no paid AI API is required.

## Stack
- Node.js + Express
- MongoDB Community (local)
- Mongoose
- bcryptjs + express-session + connect-mongo
- HTML/CSS/JavaScript
- Bootstrap
- Chart.js
- FullCalendar
- Optional local AI HTTP endpoint; otherwise rule-based planner

Chart.js is open source, and the npm ecosystem is a free public registry for open-source packages. urlChart.js official sitehttps://www.chartjs.org/

## Run on Windows
1. Install Node.js and MongoDB Community Edition.
2. Open a terminal in this folder.
3. Run `npm install`.
4. Copy `.env.example` to `.env`.
5. Start MongoDB locally.
6. Run `npm start`.
7. Open `http://localhost:3000`.

## Demo flow
Create an account → add subjects → add topics → add exams/assignments → add study availability → Generate Plan → mark sessions completed/missed → refresh dashboard/progress.

## Scheduling logic
The backend ranks pending work using exam proximity, assignment deadline, difficulty, progress, priority and missed-task status. It fills only declared availability windows and never intentionally creates overlapping generated sessions. Future pending sessions are regenerated; completed history is retained.

## Optional AI
Set `AI_API_URL`, `AI_API_KEY` and `AI_MODEL` in `.env` for a compatible chat-completions-style local/self-hosted endpoint. If these are blank or unavailable, `/api/ai/study-plan` automatically returns the built-in rule-based plan.

## API highlights
Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`  
CRUD: `/api/subjects`, `/api/topics`, `/api/exams`, `/api/assignments`, `/api/study-sessions`, `/api/availability`  
Planner: `/api/planner/generate`, `/api/planner/reschedule`  
Progress: `/api/progress`, `/api/progress/daily`, `/api/progress/weekly`  
AI: `/api/ai/study-plan`

## Requirements checklist
- [x] Registration/login/logout and password hashing
- [x] User-isolated MongoDB data
- [x] Subjects/topics CRUD
- [x] Exams and assignments
- [x] Study availability
- [x] Personalized scheduling
- [x] Completion/missed status and rescheduling endpoint
- [x] Dashboard and progress visualization
- [x] Calendar
- [x] Priority logic and weak-subject detection
- [x] AI API hook + rule-based fallback
- [x] Daily/weekly progress endpoints
- [x] Responsive Bootstrap UI
- [x] Validation/error responses

## Notes
The application is intentionally kept compact so it is understandable and editable by a college student. For a production deployment, add CSRF protection, rate limiting, stronger validation, audit logging, HTTPS-only cookies, and a background job for automatic missed-session processing.
