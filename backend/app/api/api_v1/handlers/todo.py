from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.models.user_model import User
from app.database import get_session
from app.api.deps.user_deps import get_current_user
from app.services import todo_service
from app.models.todo_model import Todo, TodoCreate, TodoUpdate

todo_router = APIRouter()


@todo_router.get("/", summary="Get all todos of the user", response_model=List[Todo])
async def list(
    *, session: Session = Depends(get_session), user: User = Depends(get_current_user)
):
    return await todo_service.list_todos(user=user, session=session)


@todo_router.post("/", summary="Create Todo", response_model=Todo)
async def create_todo(
    *,
    session: Session = Depends(get_session),
    data: TodoCreate,
    user: User = Depends(get_current_user)
):
    return await todo_service.create_todo(user=user, data=data, session=session)


@todo_router.get("/{todo_id}", summary="Get a todo by todo_id", response_model=Todo)
async def retrieve(
    *,
    session: Session = Depends(get_session),
    todo_id: UUID,
    user: User = Depends(get_current_user)
):
    return await todo_service.retrieve_todo(user=user, todo_id=todo_id, session=session)


@todo_router.put("/{todo_id}", summary="Update todo by todo_id", response_model=Todo)
async def update(
    *,
    session: Session = Depends(get_session),
    todo_id: UUID,
    data: TodoUpdate,
    user: User = Depends(get_current_user)
):
    return await todo_service.update_todo(
        user=user, todo_id=todo_id, data=data, session=session
    )


@todo_router.delete("/{todo_id}", summary="Delete todo by todo_id")
async def delete(
    *,
    session: Session = Depends(get_session),
    todo_id: UUID,
    user: User = Depends(get_current_user)
):
    await todo_service.delete_todo(user=user, todo_id=todo_id, session=session)
    return None
