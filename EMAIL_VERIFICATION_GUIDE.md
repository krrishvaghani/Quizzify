# Email Verification Setup Guide

## Overview
Quizzify now includes email verification using OTP (One-Time Password) for new user signups.

## Features
- ✅ 6-digit OTP sent to user's email
- ✅ OTP expires in 10 minutes
- ✅ Beautiful email template with gradient design
- ✅ Resend OTP functionality
- ✅ Auto-login after successful verification

## Setup Instructions

### 1. Gmail Configuration (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Quizzify" as the name
   - Click "Generate"
   - Copy the 16-character password

3. **Configure .env file**:
   ```env
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

### 2. Other Email Providers

#### Outlook/Hotmail
```env
SMTP_SERVER=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USERNAME=your-email@outlook.com
SMTP_PASSWORD=your-password
EMAIL_FROM=your-email@outlook.com
```

#### Yahoo Mail
```env
SMTP_SERVER=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USERNAME=your-email@yahoo.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=your-email@yahoo.com
```

### 3. Testing Without Email

If email is not configured, the OTP will be printed in the backend console:
```
📧 OTP generated for user@email.com: 123456 (expires in 10 minutes)
```

## User Flow

1. User fills signup form (username, email, password, etc.)
2. Click "Create Account"
3. OTP verification screen appears
4. User receives email with 6-digit code
5. Enter the 6-digit code
6. Click "Verify Email"
7. Auto-login to dashboard

## API Endpoints

### Register (Send OTP)
```
POST /register
Body: {
  "username": "string",
  "email": "string",
  "password": "string",
  "full_name": "string" (optional)
}
Response: {
  "message": "OTP sent to your email",
  "email": "user@email.com",
  "email_sent": true
}
```

### Verify OTP
```
POST /verify-otp
Body: {
  "email": "string",
  "otp": "string"
}
Response: {
  "message": "Email verified successfully",
  "access_token": "jwt-token",
  "token_type": "bearer"
}
```

### Resend OTP
```
POST /resend-otp
Body: {
  "email": "string"
}
Response: {
  "message": "New OTP sent to your email",
  "email_sent": true
}
```

## Database Collections

### pending_users
Temporary storage for unverified registrations:
```javascript
{
  username: String,
  email: String,
  full_name: String,
  hashed_password: String,
  otp: String,
  otp_expiry: DateTime,
  created_at: DateTime,
  verified: Boolean
}
```

### users
Verified users (created after OTP verification):
```javascript
{
  username: String,
  email: String,
  full_name: String,
  hashed_password: String,
  created_at: DateTime,
  verified: Boolean
}
```

## Security Features

- ✅ OTP is 6 digits (100,000 - 999,999)
- ✅ OTP expires in 10 minutes
- ✅ Pending users automatically deleted after OTP expiry
- ✅ One pending registration per email (old ones replaced)
- ✅ Passwords are hashed using bcrypt
- ✅ Rate limiting recommended for production

## Troubleshooting

### Email not sending
1. Check SMTP credentials in .env
2. Verify 2FA is enabled (for Gmail)
3. Check app password is correct
4. Look for OTP in backend console
5. Check spam/junk folder

### OTP expired
- OTPs expire after 10 minutes
- Click "Resend OTP" to get a new code

### Invalid OTP error
- Ensure all 6 digits are entered
- Check for typos
- Request new OTP if needed

## Production Recommendations

1. **Use environment variables** for sensitive data
2. **Enable rate limiting** on OTP endpoints
3. **Add email queue** for better reliability (e.g., Celery, Redis)
4. **Monitor email deliverability**
5. **Set up email analytics**
6. **Consider SMS OTP** as backup option

## Email Template Preview

The OTP email includes:
- 🎓 Quizzify branding
- Gradient design (purple/blue)
- Large, easy-to-read OTP code
- Expiry information (10 minutes)
- Security reminder
- Help text for users

## Support

For issues or questions:
- Check backend console for OTP codes during development
- Verify email configuration in .env
- Test with different email providers if needed
