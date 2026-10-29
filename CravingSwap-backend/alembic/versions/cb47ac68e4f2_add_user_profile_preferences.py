"""add user profile preferences

Revision ID: cb47ac68e4f2
Revises: 0001
Create Date: 2026-10-29 07:27:49.209322
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "cb47ac68e4f2"
down_revision: Union[str, Sequence[str], None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add additional user profile preference fields."""

    op.add_column(
        "user_profiles",
        sa.Column(
            "favorite_cuisines",
            sa.JSON(),
            nullable=False,
            server_default=sa.text("'[]'::json"),
        ),
    )

    op.add_column(
        "user_profiles",
        sa.Column(
            "cooking_skill",
            sa.String(length=30),
            nullable=True,
        ),
    )

    op.alter_column(
        "user_profiles",
        "favorite_cuisines",
        server_default=None,
    )


def downgrade() -> None:
    """Remove additional user profile preference fields."""

    op.drop_column(
        "user_profiles",
        "cooking_skill",
    )

    op.drop_column(
        "user_profiles",
        "favorite_cuisines",
    )