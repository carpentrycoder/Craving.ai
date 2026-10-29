from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import current_user
from app.db.session import get_db
from app.models import UserProfile
from app.schemas.profile import (
    UserProfileResponse,
    UserProfileUpdate,
)


r = APIRouter(
    prefix="/users",
    tags=["Users"],
)


def get_or_create_profile(user_id, db: Session):
    profile = db.scalar(
        select(UserProfile).where(
            UserProfile.user_id == user_id
        )
    )

    if profile is None:
        profile = UserProfile(user_id=user_id)

        db.add(profile)
        db.commit()
        db.refresh(profile)

    return profile


@r.get(
    "/profile",
    response_model=UserProfileResponse,
    summary="Get current user profile",
)
def get_profile(
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    return get_or_create_profile(
        user.id,
        db,
    )


@r.patch(
    "/profile",
    response_model=UserProfileResponse,
    summary="Update current user profile",
)
def update_profile(
    payload: UserProfileUpdate,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    profile = get_or_create_profile(
        user.id,
        db,
    )

    updates = payload.model_dump(
        exclude_unset=True
    )

    for field, value in updates.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)

    return profile