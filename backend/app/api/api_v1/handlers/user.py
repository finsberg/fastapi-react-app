from fastapi import APIRouter, HTTPException, status
from app.schemas.user_schema import UserAuth, UserUpdate
from fastapi import Depends
from app.services.user_service import UserService
from app.models.user_model import User
from app.api.deps.user_deps import get_current_user


user_router = APIRouter()


@user_router.post("/create", summary="Create new user", response_model=User)
async def create_user(data: UserAuth):
    try:
        return await UserService.create_user(data)
    except Exception as ex:
        print(ex)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exist",
        )


@user_router.get(
    "/me", summary="Get details of currently logged in user", response_model=User
)
async def get_me(user: User = Depends(get_current_user)):
    return user


@user_router.post("/update", summary="Update User", response_model=User)
async def update_user(data: UserUpdate, user: User = Depends(get_current_user)):
    try:
        return await UserService.update_user(user.user_id, data)
    except Exception as ex:
        print(ex)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User does not exist"
        )
