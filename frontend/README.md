## Adaptive Learning Frontend

- Dev: `npm run dev` (served at http://localhost:5173)
- Environment: create `.env` with `VITE_API_BASE=http://localhost:8000`

Routes:
- `/login`, `/signup`, `/` (home, requires auth)

Features:
- Login/Signup against FastAPI
- Upload PDF/DOCX/text to generate quiz via Gemini
