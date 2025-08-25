## Backend (FastAPI)

### Setup
1. Create and activate venv:
```
py -m venv .venv
.\.venv\Scripts\activate
```
2. Install deps:
```
pip install -r requirements.txt
```
3. Environment variables:
- `JWT_SECRET` (required)
- `GEMINI_API_KEY` (required for quiz generation)

No database required. Users are stored in `app/data/users.json`.

### Run
```
python uvicorn_app.py
```
API at http://127.0.0.1:8001 (docs at http://127.0.0.1:8001/docs)
