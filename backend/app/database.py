import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from backend.app.config import settings

db_url = settings.DATABASE_URL
if os.getenv("VERCEL") or os.getenv("VERCEL_ENV"):
    if "sqlite" in db_url and not db_url.startswith("sqlite:////tmp"):
        db_url = "sqlite:////tmp/voicearmor.db"

# For SQLite, enable check_same_thread=False
connect_args = {"check_same_thread": False} if "sqlite" in db_url else {}

engine = create_engine(db_url, connect_args=connect_args, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
