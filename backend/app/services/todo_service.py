from typing import List
from typing import Optional
from uuid import UUID

from app.models.todo_model import Todo
from app.models.todo_model import TodoCreate
from app.models.todo_model import TodoUpdate
from app.models.user_model import User
from sqlmodel import select
from sqlmodel import Session


class TodoNotFoundError(RuntimeError):
    pass


async def list_todos(user: User, session: Session) -> List[Todo]:
    statement = select(Todo).where(Todo.user_id == user.id)
    results = session.exec(statement)
    todos = results.all()

    return todos


async def create_todo(user: User, data: TodoCreate, session: Session) -> Todo:
    todo = Todo(
        title=data.title,
        description=data.description,
        status=data.status,
        user_id=user.id,
    )

    session.add(todo)
    session.commit()
    session.refresh(todo)

    return todo


async def retrieve_todo(user: User, todo_id: UUID, session: Session) -> Optional[Todo]:
    statement = select(Todo).where(Todo.id == todo_id).where(Todo.user_id == user.id)

    results = session.exec(statement)
    todo = results.first()

    return todo


async def update_todo(
    user: User,
    todo_id: UUID,
    data: TodoUpdate,
    session: Session,
) -> Todo:
    todo_data = data.dict(exclude_unset=True)
    todo = await retrieve_todo(user, todo_id, session=session)

    if todo is None:
        raise TodoNotFoundError(f"Todo with id {todo_id} not found")

    for key, value in todo_data.items():
        print(key, value)
        setattr(todo, key, value)

    session.add(todo)
    session.commit()
    session.refresh(todo)

    return todo


async def delete_todo(user: User, todo_id: UUID, session: Session) -> None:
    todo = await retrieve_todo(user, todo_id, session=session)
    session.delete(todo)
    session.commit()

    return None
