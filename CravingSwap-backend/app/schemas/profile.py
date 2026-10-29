from pydantic import Field

from app.schemas.common import APIModel


class UserProfileResponse(APIModel):
    preferred_language: str = "en"
    budget_preference: str | None = None

    dietary_preferences: list[str] = Field(default_factory=list)
    allergies: list[str] = Field(default_factory=list)
    disliked_foods: list[str] = Field(default_factory=list)
    favorite_cuisines: list[str] = Field(default_factory=list)

    cooking_skill: str | None = None

    max_cooking_time: int | None = Field(
        default=None,
        ge=0,
        le=1440,
    )


class UserProfileUpdate(APIModel):
    preferred_language: str | None = None
    budget_preference: str | None = None

    dietary_preferences: list[str] | None = None
    allergies: list[str] | None = None
    disliked_foods: list[str] | None = None
    favorite_cuisines: list[str] | None = None

    cooking_skill: str | None = None

    max_cooking_time: int | None = Field(
        default=None,
        ge=0,
        le=1440,
    )