from typing import Optional
from pydantic import BaseModel, Field


class TodoCreate(BaseModel):
    title: str = Field(..., title="Title", max_length=55, min_length=1)
    description: str = Field(..., title="Title", max_length=755, min_length=1)
    status: Optional[bool] = False


class TodoUpdate(BaseModel):
    title: Optional[str] = Field(..., title="Title", max_length=55, min_length=1)
    description: Optional[str] = Field(..., title="Title", max_length=755, min_length=1)
    status: Optional[bool] = False
