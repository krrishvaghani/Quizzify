# Quiz Attempts Troubleshooting Guide

## 🔍 Issue: Quiz Attempts Not Showing in Recent Results

### Root Cause
When you take a public quiz, the system saves your attempt with the **email address you entered in the quiz form**. If this email doesn't match your logged-in account email, the attempts won't appear in your Dashboard or Profile.

### Example from Your Database:
- **Logged in as**: `krrishvaghani9@gmail.com` or `krishvaghani11@gmail.com`
- **Quiz attempts exist for**:
  - `krrishvaghani9@gmail.com` - 2 attempts ✅
  - `krishvaghani11@gmail.com` - 1 attempt ✅
  - `k@gmail.com` - 3 attempts (different email, won't show up)
  - Other test emails - won't show up

---

## ✅ Solution & Updates Made

### 1. **Backend Endpoint Created**
- **New endpoint**: `GET /my-attempts`
- **Function**: Returns all quiz attempts where `student_email` matches your logged-in email
- **Location**: `backend/main.py` (around line 1213)

### 2. **Frontend API Updated**
- **New function**: `quizAPI.getMyAttempts()`
- **Location**: `frontend/src/utils/api.js`

### 3. **Auto-Fill User Email in Quizzes**
- **Updated**: `TakeQuizPublic.jsx`
- **Behavior**: When you're logged in and take a quiz, your email is automatically filled in
- **Benefit**: Future quiz attempts will use your logged-in email

### 4. **Added Refresh Button**
- **Location**: Dashboard → Recent Results section
- **Purpose**: Manually refresh attempts without reloading the page
- **Icon**: 🔄 Refresh button next to "Recent Results" heading

### 5. **Console Logging Added**
- **Purpose**: Debug and see what data is being fetched
- **Check**: Open browser DevTools (F12) → Console tab

---

## 🧪 How to Test

### Option 1: Take a New Quiz
1. **Make sure you're logged in** to your account
2. Go to Dashboard and click on any quiz
3. **Check the email field** - it should be auto-filled with your account email
4. Complete the quiz
5. Return to Dashboard
6. Click the **🔄 Refresh** button in Recent Results
7. Your attempt should appear immediately

### Option 2: Check Console for Data
1. Open Dashboard
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Look for messages like:
   ```
   📊 Fetching recent attempts...
   ✅ Recent attempts data: {attempts: Array(2)}
   ```
5. Expand the data to see what attempts are being returned

### Option 3: Verify Database
Run this command to see all your attempts:
```bash
python C:\Quizzify\backend\test_my_attempts.py
```

---

## 📋 Current Attempt Status

### User: `krrishvaghani9@gmail.com`
- ✅ 2 attempts saved
- Quiz 1: "Quiz from 1-ML-Intro.pdf" (20.0% - 2/10)
- Quiz 2: "Quiz from 1-ML-Intro.pdf" (100% - 5/5)

### User: `krishvaghani11@gmail.com`
- ✅ 1 attempt saved
- Quiz 1: "Quiz from 1-ML-Intro.pdf" (20.0% - 2/10)

---

## 🔧 Manual Fix for Old Attempts

If you have old attempts with wrong emails and want to see them:

### Option A: Update Attempt Emails in Database
```python
# Run this script to update old attempts
python C:\Quizzify\backend\fix_attempt_emails.py
```

### Option B: Retake the Quiz
Simply retake the quiz while logged in, and the new attempt will use the correct email.

---

## 🎯 Next Steps

1. **Refresh your Dashboard page** (F5 or Ctrl+R)
2. Click the **🔄 Refresh button** in Recent Results
3. Check the **browser console** (F12) for any errors
4. If attempts still don't show:
   - Verify you're logged in with the same email used in quiz attempts
   - Check which email was used when taking the quiz
   - Make sure the backend server is running

---

## 📞 Quick Checks

### Is Backend Running?
```bash
curl http://localhost:8000/docs
```
Should return status 200

### Check Your Logged-in Email
Look at the top-right corner of the Dashboard - your username and email should be visible

### Test the Endpoint Directly
Open browser and go to:
```
http://localhost:8000/my-attempts
```
(Must be logged in - include token in Authorization header)

---

## 🐛 Common Issues

### Issue: "No quiz attempts yet" message
**Cause**: No attempts match your logged-in email
**Solution**: 
- Take a new quiz while logged in
- Or check which email you used previously

### Issue: Console shows 401 Unauthorized
**Cause**: Not logged in or token expired
**Solution**: Log out and log back in

### Issue: Console shows 404 Not Found
**Cause**: Backend server not running or endpoint missing
**Solution**: Restart backend server

---

## 📊 Database Query Examples

### See All Your Attempts
```javascript
// In browser console (while logged in)
fetch('http://localhost:8000/my-attempts', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => console.table(data.attempts))
```

### Check All Attempts in Database
```bash
python C:\Quizzify\backend\check_all_attempts.py
```

---

## ✨ Features Added

1. **Auto-fill email** when taking quizzes (if logged in)
2. **Manual refresh button** in Recent Results
3. **Better console logging** for debugging
4. **Modal popup** with detailed question breakdown
5. **Dark theme cards** with gradient icons in Recent Results
6. **Backend endpoint** to fetch user's own attempts

---

## 📝 Files Modified

- `backend/main.py` - Added `/my-attempts` endpoint
- `frontend/src/utils/api.js` - Added `getMyAttempts()` function
- `frontend/src/pages/Dashboard.jsx` - Added refresh button and logging
- `frontend/src/pages/Profile.jsx` - Added logging
- `frontend/src/pages/TakeQuizPublic.jsx` - Auto-fill user email

---

**Last Updated**: November 9, 2025
