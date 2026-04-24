import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME", "dummy@example.com"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", "dummy-password"),
    MAIL_FROM=os.getenv("MAIL_FROM", "noreply@invoiceflow.com"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

fm = FastMail(conf)

async def send_welcome_email(email: EmailStr):
    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #6366f1;">Welcome to InvoiceFlow!</h2>
        <p>Hi there,</p>
        <p>Thank you for registering. We are thrilled to have you on board!</p>
        <p>You can now log in and start managing your workspace.</p>
        <br>
        <p>Best regards,<br>The InvoiceFlow Team</p>
    </body>
    </html>
    """
    message = MessageSchema(
        subject="Welcome to InvoiceFlow",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )
    # If no real credentials, fail silently or log in production. 
    # For now, it will try to send and might fail if dummy config.
    try:
        await fm.send_message(message)
    except Exception as e:
        print(f"Failed to send welcome email to {email}: {e}")


async def send_reset_password_email(email: EmailStr, token: str):
    # En producción este link debería apuntar a tu dominio real
    frontend_url = os.getenv("FRONTEND_URL", "http://192.168.1.231:8088")
    reset_link = f"{frontend_url}/reset-password?token={token}"
    
    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #6366f1;">Reset Your Password</h2>
        <p>We received a request to reset your password for your InvoiceFlow account.</p>
        <p>Click the link below to set a new password. This link is valid for 15 minutes.</p>
        <a href="{reset_link}" style="display: inline-block; padding: 10px 20px; background-color: #6366f1; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <br><br>
        <p>If you didn't request this, you can safely ignore this email.</p>
    </body>
    </html>
    """
    message = MessageSchema(
        subject="InvoiceFlow - Password Reset Request",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )
    try:
        await fm.send_message(message)
    except Exception as e:
        print(f"Failed to send reset email to {email}: {e}")
