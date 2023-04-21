import functools

import pytest
from app.api.deps.user_deps import get_current_user
from app.core.config import settings
from app.core.security import get_password
from app.database import get_session
from app.main import app
from app.models.user_model import User
from fastapi.testclient import TestClient
from sqlmodel import create_engine
from sqlmodel import Session
from sqlmodel import SQLModel
from sqlmodel.pool import StaticPool


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@functools.lru_cache
def get_current_user_override():
    return User(
        username="currentuser",
        email="currentuser@gmail.com",
        firstName="Current",
        lastName="User",
        hashed_password=get_password("verylongpassword"),
    )


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_current_user] = get_current_user_override
    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture
def prefix():
    return settings.API_V1_STR
