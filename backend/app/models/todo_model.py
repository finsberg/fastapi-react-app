from typing import Optional
from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import Field, SQLModel


class Todo(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    status: bool = False
    title: str = Field(index=True)
    description: str = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    user_id: Optional[UUID] = Field(default=None, foreign_key="user.id")
