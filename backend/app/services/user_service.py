from typing import Optional, List
from uuid import UUID

from sqlmodel import Session, select, or_

from app.models.user_model import User, UserCreate, UserUpdate
from app.core.security import get_password, verify_password, UnauthorizedError


class UserExistsError(RuntimeError):
    pass


class UserNotFoundError(RuntimeError):
    pass


async def check_user_exists(user: UserCreate, session: Session) -> None:
    statement = select(User).where(
        or_(User.username == user.username, User.email == user.email)
    )
    results = session.exec(statement).all()
    if len(results) > 0:
        raise UserExistsError(f"User {user} already exists")


async def create_user(*, session: Session, user: UserCreate) -> User:

    await check_user_exists(user=user, session=session)

    user_in = User(
        username=user.username,
        email=user.email,
        hashed_password=get_password(user.password),
        firstName=user.firstName,
        lastName=user.lastName,
        isAdmin=user.isAdmin,
    )

    session.add(user_in)
    session.commit()
    session.refresh(user_in)

    return user_in


async def authenticate(
    username: str, password: str, session: Session
) -> Optional[User]:
    user = await get_user_by_name(username=username, session=session)
    if not user:
        return None
    if not verify_password(password=password, hashed_pass=user.hashed_password):
        return None

    return user


async def get_user_by_name(username: str, session: Session) -> Optional[User]:

    statement = select(User).where(User.username == username)
    results = session.exec(statement)
    user = results.first()

    return user


async def get_user_by_id(id: UUID, session: Session) -> Optional[User]:

    statement = select(User).where(User.id == id)
    results = session.exec(statement)
    user = results.first()

    return user


async def update_user(id: UUID, data: UserUpdate, session: Session) -> User:

    statement = select(User).where(User.id == id)
    results = session.exec(statement)
    user = results.first()

    if not user:
        raise UserNotFoundError(f"User with id {id} not found")

    if not verify_password(password=data.password, hashed_pass=user.hashed_password):
        raise UnauthorizedError("Wrong password passed when trying to update user")

    for attr in ["firstName", "lastName", "email", "username", "isAdmin"]:
        value = getattr(data, attr)
        if value is not None:
            setattr(user, attr, value)

    if data.new_password is not None:
        user.hashed_password = get_password(data.new_password)

    session.add(user)
    session.commit()
    session.refresh(user)

    return user
