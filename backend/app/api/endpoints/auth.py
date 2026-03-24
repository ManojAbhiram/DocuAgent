from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.api.deps import SessionDep, CurrentUser
from app.core import security
from app.core.config import settings
from app.models.user import User

router = APIRouter()

@router.post("/login")
def login_access_token(
    session: SessionDep, form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = session.query(User).filter(User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            {"sub": str(user.id)}, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/register")
def register_user(
    session: SessionDep, email: str, password: str, role: str = "User"
) -> Any:
    """
    Create new user.
    """
    user = session.query(User).filter(User.email == email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    hashed_password = security.get_password_hash(password)
    user = User(email=email, hashed_password=hashed_password, role=role)
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"message": "User created successfully", "user_id": user.id}

@router.get("/me")
def read_user_me(current_user: CurrentUser) -> Any:
    """
    Get current user.
    """
    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active
    }
