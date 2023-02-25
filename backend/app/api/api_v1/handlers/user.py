from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from fastapi import Depends
from sqlmodel import Session

from app.core import security
from app.services import user_service
from app.database import get_session
from app.models.user_model import User, UserUpdate, UserCreate
from app.api.deps.user_deps import get_current_user  # , oauth2_scheme

user_router = APIRouter()  # dependencies=[Depends(oauth2_scheme)])


@user_router.post("/", summary="Create new user", response_model=User)
async def create_user(*, session: Session = Depends(get_session), data: UserCreate):
    try:
        return await user_service.create_user(user=data, session=session)
    except user_service.UserExistsError as ex:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(ex))
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ex))


@user_router.get(
    "/me", summary="Get details of currently logged in user", response_model=User
)
async def get_me(user: User = Depends(get_current_user)):
    return user


@user_router.put("/{user_id}", summary="Update User", response_model=User)
async def update_user(
    *, session: Session = Depends(get_session), user_id: UUID, data: UserUpdate
):
    try:
        return await user_service.update_user(id=user_id, data=data, session=session)
    except user_service.UserNotFoundError as ex:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=[{"msg": str(ex)}]
        )
    except security.UnauthorizedError as ex:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=[{"msg": str(ex)}]
        )
    except Exception as ex:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=[{"msg": str(ex)}]
        )
