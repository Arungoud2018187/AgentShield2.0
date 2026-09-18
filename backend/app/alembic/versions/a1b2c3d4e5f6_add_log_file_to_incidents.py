"""add log file columns to incidents

Revision ID: a1b2c3d4e5f6
Revises: 9e7f1c2d3a4b
Create Date: 2026-09-18 12:55:00.000000
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "9e7f1c2d3a4b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    from sqlalchemy import inspect
    bind = op.get_bind()
    insp = inspect(bind)
    existing_cols = [c["name"] for c in insp.get_columns("incidents")]
    if "log_file_name" not in existing_cols:
        op.add_column("incidents", sa.Column("log_file_name", sa.String(length=255), nullable=True))
    if "log_file_content" not in existing_cols:
        op.add_column("incidents", sa.Column("log_file_content", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("incidents", "log_file_content")
    op.drop_column("incidents", "log_file_name")

