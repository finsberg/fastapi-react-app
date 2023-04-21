from datetime import datetime
from datetime import timedelta
from typing import Any
from typing import Union
from uuid import UUID

import jwt
from app.core.config import settings
from passlib.context import CryptContext
from pydantic import BaseModel

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UnauthorizedError(RuntimeError):
    pass


class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str


class TokenPayload(BaseModel):
    sub: UUID = UUID(int=0)
    exp: int = 60


def create_access_token(
    subject: Union[str, Any],
    expires_delta: int | None = None,
) -> str:
    if expires_delta is not None:
        exp = datetime.utcnow() + timedelta(minutes=expires_delta)
    else:
        exp = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
        )

    to_encode = {"exp": exp, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, settings.ALGORITHM)
    return encoded_jwt


def create_refresh_token(
    subject: Union[str, Any],
    expires_delta: int | None = None,
) -> str:
    if expires_delta is not None:
        exp = datetime.utcnow() + timedelta(minutes=expires_delta)
    else:
        exp = datetime.utcnow() + timedelta(
            minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES,
        )

    to_encode = {"exp": exp, "sub": str(subject)}
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_REFRESH_SECRET_KEY,
        settings.ALGORITHM,
    )
    return encoded_jwt


def get_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    return password_context.verify(password, hashed_pass)
