from typing import Optional

from pypdf import PdfReader
from docx import Document


def extract_text_from_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    texts: list[str] = []
    for page in reader.pages:
        page_text = page.extract_text() or ""
        texts.append(page_text)
    return "\n".join(texts)


def extract_text_from_docx(file_path: str) -> str:
    document = Document(file_path)
    return "\n".join(p.text for p in document.paragraphs)


def extract_text_auto(file_path: str, filename: Optional[str] = None) -> str:
    name = (filename or file_path).lower()
    if name.endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    if name.endswith(".docx") or name.endswith(".doc"):
        return extract_text_from_docx(file_path)
    # Fallback: treat as text
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()


