from datetime import datetime
from typing import Optional
from uuid import UUID
from uuid import uuid4

from sqlmodel import Field
from sqlmodel import SQLModel


class TodoBase(SQLModel):
    title: str | None = Field(description="Title of todo", max_length=55, min_length=1)
    description: str | None = Field(
        default=None,
        description="Description of todo",
        max_length=755,
        min_length=1,
    )
    status: bool = Field(
        default=False,
        description="Flag to indicate if todo is done or not",
    )


class TodoCreate(TodoBase):
    pass


class TodoUpdate(TodoBase):
    pass


class Todo(TodoBase, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    status: bool = False
    title: str = Field(
        index=True,
        description="Title of todo",
        max_length=55,
        min_length=1,
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    user_id: Optional[UUID] = Field(default=None, foreign_key="user.id")
