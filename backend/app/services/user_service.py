from typing import Optional
from uuid import UUID
from app.schemas.user_schema import UserAuth
from app.models.user_model import User
from app.core.security import get_password, verify_password
from app.database import engine
from sqlmodel import Session, select

# import pymongo

from app.schemas.user_schema import UserUpdate


class UserService:
    @staticmethod
    async def create_user(user: UserAuth) -> User:
        user_in = User(
            username=user.username,
            email=user.email,
            hashed_password=get_password(user.password),
        )
        with Session(engine) as session:
            session.add(user_in)
            session.commit()
            session.refresh(user_in)

        return user_in

    @staticmethod
    async def authenticate(email: str, password: str) -> Optional[User]:
        user = await UserService.get_user_by_email(email=email)
        if not user:
            return None
        if not verify_password(password=password, hashed_pass=user.hashed_password):
            return None

        return user

    @staticmethod
    async def get_user_by_email(email: str) -> Optional[User]:
        with Session(engine) as session:
            statement = select(User).where(User.email == email)
            results = session.exec(statement)
            user = results.first()

        return user

    @staticmethod
    async def get_user_by_id(id: UUID) -> Optional[User]:
        with Session(engine) as session:
            statement = select(User).where(User.id == id)
            results = session.exec(statement)
            user = results.first()

        return user

    @staticmethod
    async def update_user(id: UUID, data: UserUpdate) -> User:
        with Session(engine) as session:
            statement = select(User).where(User.id == id)
            results = session.exec(statement)
            user = results.first()

            if not user:
                raise RuntimeError("User not found")
            breakpoint()
            user.update({"$set": data.dict(exclude_unset=True)})
        return user
