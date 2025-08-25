import os
import tempfile
from typing import List

from fastapi import APIRouter, File, HTTPException, UploadFile, Query
from fastapi import status

from app.services.extract import extract_text_auto
from app.services.gemini import generate_quiz_questions


router = APIRouter()


CHUNK_SIZE = 1024 * 1024  # 1MB per chunk


@router.post("/generate", response_model=List[dict])
async def generate_quiz(file: UploadFile = File(...), num_questions: int = Query(5, ge=1, le=100)):
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File name required")

    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp_path = tmp.name
        # Stream copy to avoid loading entire file into memory
        while True:
            chunk = await file.read(CHUNK_SIZE)
            if not chunk:
                break
            tmp.write(chunk)

    try:
        text = extract_text_auto(tmp_path, file.filename)
        questions = generate_quiz_questions(text, num_questions=num_questions)
        return questions
    finally:
        try:
            os.remove(tmp_path)
        except Exception:
            pass


