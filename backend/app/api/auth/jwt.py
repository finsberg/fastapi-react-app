from typing import Any

import jwt
from app.api.deps.user_deps import get_current_user
from app.core.config import settings
from app.core.security import create_access_token
from app.core.security import create_refresh_token
from app.core.security import TokenPayload
from app.core.security import TokenSchema
from app.database import get_session
from app.models.user_model import User
from app.services import user_service
from fastapi import APIRouter
from fastapi import Body
from fastapi import Depends
from fastapi import HTTPException
from fastapi import status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import ValidationError
from sqlmodel import Session


auth_router = APIRouter()


@auth_router.post(
    "/login",
    summary="Create access and refresh tokens for user",
    response_model=TokenSchema,
)
async def login(
    *,
    session: Session = Depends(get_session),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    user = await user_service.authenticate(
        username=form_data.username,
        password=form_data.password,
        session=session,
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password",
        )

    return {
        "access_token": create_access_token(user.id),
        "refresh_token": create_refresh_token(user.id),
    }


@auth_router.post(
    "/test-token",
    summary="Test if the access token is valid",
    response_model=User,
)
async def test_token(user: User = Depends(get_current_user)):
    return user


@auth_router.post("/refresh", summary="Refresh token", response_model=TokenSchema)
async def refresh_token(
    refresh_token: str = Body(...),
    session: Session = Depends(get_session),
):
    try:
        payload = jwt.decode(
            refresh_token,
            settings.JWT_REFRESH_SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        token_data = TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = await user_service.get_user_by_id(token_data.sub, session=session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid token for user",
        )
    return {
        "access_token": create_access_token(user.id),
        "refresh_token": create_refresh_token(user.id),
    }
