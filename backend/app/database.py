from app.core.config import settings
from sqlmodel import create_engine
from sqlmodel import Session
from sqlmodel import SQLModel

connect_args = {"check_same_thread": False}
engine = create_engine(
    settings.SQL_CONNECTION_STRING,
    echo=True,
    connect_args=connect_args,
)


def get_session():
    with Session(engine) as session:
        yield session


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
