import sys
import os

# Add the backend to sys.path
sys.path.append(r"c:\Users\DELL\Desktop\DocuAgent\backend")

from app.db.session import SessionLocal
from app.models.user import User
from app.core import security
from app.db.base import Base
from app.db.session import engine

def seed_users():
    db = SessionLocal()
    try:
        Base.metadata.create_all(bind=engine)
        
        users = [
            {"email": "admin@docuagent.com", "password": "Admin@1234", "role": "Admin"},
            {"email": "user@docuagent.com", "password": "User@1234", "role": "User"},
            {"email": "finance@docuagent.com", "password": "Finance@1234", "role": "Finance"},
            {"email": "legal@docuagent.com", "password": "Legal@1234", "role": "Legal"},
        ]
        
        for u in users:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if existing:
                print(f"User {u['email']} already exists. Updating password...")
                existing.hashed_password = security.get_password_hash(u["password"])
                existing.role = u["role"]
            else:
                print(f"Creating user {u['email']}...")
                new_user = User(
                    email=u["email"], 
                    hashed_password=security.get_password_hash(u["password"]), 
                    role=u["role"]
                )
                db.add(new_user)
        
        db.commit()
        print("Seed users created/updated successfully.")
        
    except Exception as e:
        print(f"FAILED: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_users()
