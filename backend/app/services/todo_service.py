from typing import List, Optional
from uuid import UUID
from app.models.user_model import User
from app.models.todo_model import Todo
from app.schemas.todo_schema import TodoCreate, TodoUpdate
from app.database import engine
from sqlmodel import Session, select


class TodoService:
    @staticmethod
    async def list_todos(user: User) -> List[Todo]:
        with Session(engine) as session:
            statement = select(Todo)
            results = session.exec(statement)
            todos = results.all()

        return todos

    @staticmethod
    async def create_todo(user: User, data: TodoCreate) -> Todo:
        todo = Todo(**data.dict(), user_id=user.id)
        with Session(engine) as session:
            session.add(todo)
            session.commit()
            session.refresh(todo)

        return todo

    @staticmethod
    async def retrieve_todo(
        current_user: User, todo_id: UUID, session: Optional[Session] = None
    ) -> Optional[Todo]:
        close_session = True
        if session is None:
            session = Session(engine)

        statement = (
            select(Todo)
            .where(Todo.id == todo_id)
            .where(Todo.user_id == current_user.id)
        )

        results = session.exec(statement)
        todo = results.first()
        if close_session:
            session.close()

        return todo

    @staticmethod
    async def update_todo(current_user: User, todo_id: UUID, data: TodoUpdate) -> Todo:

        todo_data = data.dict(exclude_unset=True)
        with Session(engine) as session:
            todo = await TodoService.retrieve_todo(
                current_user, todo_id, session=session
            )
            for key, value in todo_data.items():
                setattr(todo, key, value)
            session.add(todo)
            session.commit()
            session.refresh(todo)

            return todo

    @staticmethod
    async def delete_todo(current_user: User, todo_id: UUID) -> None:

        with Session(engine) as session:
            todo = await TodoService.retrieve_todo(
                current_user, todo_id, session=session
            )
            session.delete(todo)
            session.commit()

        return None
