from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserIn(BaseModel):
    email: EmailStr
    password: str


class UserDB(BaseModel):
    id: str
    email: EmailStr
    password_hash: str


class UserOut(BaseModel):
    id: str
    email: EmailStr


