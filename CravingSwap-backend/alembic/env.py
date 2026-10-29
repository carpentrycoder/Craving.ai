from alembic import context
from sqlalchemy import engine_from_config,pool
from app.core.config import settings
from app.db.base import Base
from app.models import *
config=context.config;config.set_main_option('sqlalchemy.url',settings.database_url);target_metadata=Base.metadata
if context.is_offline_mode():
 context.configure(url=settings.database_url,target_metadata=target_metadata,literal_binds=True,compare_type=True)
 with context.begin_transaction():context.run_migrations()
else:
 with engine_from_config(config.get_section(config.config_ini_section),prefix='sqlalchemy.',poolclass=pool.NullPool).connect() as c:
  context.configure(connection=c,target_metadata=target_metadata,compare_type=True)
  with context.begin_transaction():context.run_migrations()
