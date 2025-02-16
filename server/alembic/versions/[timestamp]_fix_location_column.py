"""fix location column type

Revision ID: [generate_unique_id]
Revises: [previous_revision_id]
Create Date: [current_timestamp]
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic
revision = "[generate_unique_id]"
down_revision = "[previous_revision_id]"
branch_labels = None
depends_on = None


def upgrade():
    # First convert to text type as intermediate step
    op.execute("ALTER TABLE activities ALTER COLUMN location TYPE text")
    # Then convert from text to json
    op.execute(
        "ALTER TABLE activities ALTER COLUMN location TYPE json USING location::json"
    )


def downgrade():
    # Convert back to text type
    op.execute("ALTER TABLE activities ALTER COLUMN location TYPE text")
