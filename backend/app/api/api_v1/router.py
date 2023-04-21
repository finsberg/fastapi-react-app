from app.api.api_v1.handlers import todo
from app.api.api_v1.handlers import user
from app.api.auth.jwt import auth_router
from fastapi import APIRouter

router = APIRouter()

router.include_router(user.user_router, prefix="/users", tags=["users"])
router.include_router(todo.todo_router, prefix="/todo", tags=["todo"])
router.include_router(auth_router, prefix="/auth", tags=["auth"])


@router.get("/health", tags=["health"])
async def health():
    return {"msg": "OK"}
