from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
from database import SessionLocal, engine
from schemas import UserCreate, LoginData, ForgotPasswordRequest, ResetPasswordRequest
from auth import hash_password, verify_password, create_access_token, create_reset_token, verify_reset_token
from email_utils import send_welcome_email, send_reset_password_email

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="InvoiceFlow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "InvoiceFlow backend running"}


@app.post("/register")
def register(user: UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user.email).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = models.User(
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()

    # Trigger welcome email in background
    background_tasks.add_task(send_welcome_email, user.email)

    return {"message": "User created"}


@app.post("/login")
def login(data: LoginData, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.email})

    return {"access_token": token, "token_type": "bearer"}


@app.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == req.email).first()
    if not user:
        # We still return success to prevent email enumeration attacks
        return {"message": "If that email is in our database, we have sent a reset link"}
    
    reset_token = create_reset_token(user.email)
    background_tasks.add_task(send_reset_password_email, user.email, reset_token)
    
    return {"message": "If that email is in our database, we have sent a reset link"}


@app.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = verify_reset_token(req.token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.password = hash_password(req.new_password)
    db.commit()
    
    return {"message": "Password updated successfully"}