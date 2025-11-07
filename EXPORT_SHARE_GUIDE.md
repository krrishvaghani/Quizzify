# Export & Share Options - Complete Guide

## 🎯 Overview

Quizify provides comprehensive export and sharing functionality for teachers to:
- **Export student results** as CSV for analysis
- **Generate PDF** versions of quizzes with answers for printing
- **Control quiz visibility** with flexible sharing options
- **Protect quizzes** with password authentication

---

## 📤 Export Features

### 1. CSV Export - Student Results

**Purpose**: Download all quiz attempts with detailed student performance data

**What's Included**:
- Student name
- Email address
- Score (correct answers)
- Total questions
- Percentage achieved
- Time taken (seconds & formatted)
- Submission timestamp

**Use Cases**:
- Send results to department heads
- Import into Excel/Google Sheets for analysis
- Track student performance over time
- Generate reports for administration

**How to Use**:
1. Navigate to Dashboard
2. Click "Export" button on any quiz
3. Click "Export CSV" button
4. File downloads automatically: `QuizTitle_attempts.csv`

**Sample CSV Output**:
```csv
Student Name,Email,Score,Total Questions,Percentage,Time Taken (seconds),Time Taken (formatted),Submitted At
John Doe,john@example.com,8,10,80.0%,420,7m 0s,2025-11-07 14:30:25
Jane Smith,jane@example.com,9,10,90.0%,380,6m 20s,2025-11-07 14:35:10
Bob Johnson,bob@example.com,7,10,70.0%,450,7m 30s,2025-11-07 14:40:55
```

---

### 2. PDF Export - Quiz with Answers

**Purpose**: Generate a formatted PDF of the complete quiz with answer keys

**What's Included**:
- Quiz title and metadata
- All questions in order
- All answer options
- Correct answers marked with ✓
- Explanations for each question
- Professional formatting

**Use Cases**:
- Print quiz for offline distribution
- Create answer keys for grading
- Share with colleagues for review
- Archive quiz versions

**How to Use**:
1. Navigate to Dashboard
2. Click "Export" button on any quiz
3. Click "Export PDF" button
4. File downloads automatically: `QuizTitle_with_answers.pdf`

**PDF Format Example**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                    Introduction to Python
               Created: November 7, 2025
                Total Questions: 10

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Question 1: What is Python?

A. A type of snake
B. A programming language ✓
C. A database
D. An operating system

Explanation: Python is a high-level programming language known for its simplicity and versatility.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔗 Share Options

### Visibility Settings

#### 1. Public
**Access**: Anyone with the link can access the quiz
**Best For**: 
- Open online courses
- Public educational content
- Community quizzes

**Features**:
- No login required
- Searchable (if indexed)
- Maximum reach

---

#### 2. Unlisted (Default)
**Access**: Only people you share the link with can access
**Best For**:
- Class quizzes
- Controlled distribution
- Most educational scenarios

**Features**:
- No login required
- Not searchable
- Link-based access
- Good privacy balance

---

#### 3. Password Protected
**Access**: Requires password to access the quiz
**Best For**:
- Private assessments
- Confidential tests
- Controlled access needed

**Features**:
- No login required
- Password entry screen
- Maximum security
- Single shared password

**Password Entry Screen**:
```
┌──────────────────────────────────────┐
│  🔒 Quiz Password Required           │
│                                      │
│  This quiz is password protected.   │
│  Please enter the password to        │
│  continue.                           │
│                                      │
│  Password: [_________________]       │
│                                      │
│  [ Cancel ]  [ Access Quiz ]         │
└──────────────────────────────────────┘
```

---

## 🎓 Teacher Workflow Example

### Scenario: End of Unit Assessment

**Step 1: Create Quiz**
- Generate quiz from study materials
- Review and edit questions
- Add explanations

**Step 2: Configure Sharing**
1. Click "Export" on quiz
2. Set visibility to "Password Protected"
3. Create password: "Unit5Test2025"
4. Save settings

**Step 3: Share with Students**
- Copy share link
- Share in LMS or via email
- Provide password to students
- Students can access from any device

**Step 4: Monitor Progress**
- View attempts table on export page
- See real-time submissions
- Track completion rates

**Step 5: Export Results**
1. After deadline, click "Export CSV"
2. Open in Excel/Google Sheets
3. Sort by percentage
4. Calculate class average
5. Identify students needing help

**Step 6: Share with HOD**
- Email CSV file to department head
- Include PDF version for reference
- HOD can review class performance
- Discuss intervention strategies

---

## 🖥️ User Interface

### Export Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                            │
└─────────────────────────────────────────────────────────────────┘

Quiz Title: Introduction to Python
👥 30 attempts  •  📄 10 questions

┌──────────────────────┐  ┌──────────────────────┐
│  📤 Export Options   │  │  🔗 Share Options    │
├──────────────────────┤  ├──────────────────────┤
│                      │  │                      │
│  📊 Export as CSV    │  │  Share Link:         │
│  ┌────────────────┐  │  │  [http://...]  [📋]  │
│  │ Includes:      │  │  │                      │
│  │ • Student name │  │  │  Visibility:         │
│  │ • Score        │  │  │  ○ Public            │
│  │ • Percentage   │  │  │  ◉ Unlisted          │
│  │ • Time taken   │  │  │  ○ Password Protected│
│  └────────────────┘  │  │                      │
│  [Download CSV]      │  │  [Save Settings]     │
│                      │  │                      │
│  📄 Export as PDF    │  └──────────────────────┘
│  ┌────────────────┐  │
│  │ Perfect for:   │  │
│  │ • Printing     │  │
│  │ • Answer keys  │  │
│  │ • Archiving    │  │
│  └────────────────┘  │
│  [Download PDF]      │
│                      │
└──────────────────────┘

Recent Attempts (10 of 30)
┌────────────┬──────────────┬───────┬────────────┬──────┐
│ Student    │ Email        │ Score │ Percentage │ Time │
├────────────┼──────────────┼───────┼────────────┼──────┤
│ John Doe   │ john@...     │ 8/10  │ 80.0%     │ 7m   │
│ Jane Smith │ jane@...     │ 9/10  │ 90.0%     │ 6m   │
│ Bob John.. │ bob@...      │ 7/10  │ 70.0%     │ 7m   │
└────────────┴──────────────┴───────┴────────────┴──────┘
```

---

## 🔧 Technical Implementation

### Backend Endpoints

#### Get Quiz Attempts
```python
GET /quizzes/{quiz_id}/attempts
Authorization: Bearer {token}

Response:
{
  "quiz_id": "123",
  "quiz_title": "Introduction to Python",
  "total_attempts": 30,
  "attempts": [
    {
      "id": "attempt_123",
      "student_name": "John Doe",
      "student_email": "john@example.com",
      "score": 8,
      "total_questions": 10,
      "percentage": 80.0,
      "time_taken": 420,
      "submitted_at": "2025-11-07T14:30:25"
    }
  ]
}
```

#### Export CSV
```python
GET /quizzes/{quiz_id}/export/csv
Authorization: Bearer {token}

Response: 
Content-Type: text/csv
Content-Disposition: attachment; filename="quiz_attempts.csv"
[CSV data stream]
```

#### Export PDF
```python
GET /quizzes/{quiz_id}/export/pdf
Authorization: Bearer {token}

Response:
Content-Type: application/pdf
Content-Disposition: attachment; filename="quiz_with_answers.pdf"
[PDF binary stream]
```

#### Update Share Settings
```python
PUT /quizzes/{quiz_id}/share-settings
Authorization: Bearer {token}

Request Body:
{
  "visibility": "password_protected",
  "password": "MySecurePassword123",
  "allow_anonymous": true
}

Response:
{
  "message": "Share settings updated successfully",
  "settings": {
    "visibility": "password_protected",
    "allow_anonymous": true,
    "has_password": true
  }
}
```

#### Verify Quiz Access
```python
POST /public/quiz/{quiz_id}/verify-access

Request Body:
{
  "password": "MySecurePassword123"
}

Response:
{
  "access_granted": true,
  "message": "Access granted"
}

Error Response (401):
{
  "detail": "Incorrect password"
}
```

---

## 📊 Dashboard Integration

### Enhanced Quiz Card

Each quiz in the dashboard now includes 4 action buttons:

```
┌──────────────────────────────────────────────────────────┐
│  Introduction to Python                                  │
│  📄 10 questions  •  📅 Nov 7, 2025                      │
│                                                          │
│  [📄 View] [✏️ Edit] [📥 Export] [🔗 Share] [🗑️ Delete]  │
└──────────────────────────────────────────────────────────┘
```

**Buttons**:
1. **View** (Blue): Preview quiz
2. **Edit** (Purple): Edit questions
3. **Export** (Orange): Access export/share page ← NEW
4. **Share** (Green): Quick copy link
5. **Delete** (Red): Remove quiz

---

## 🔐 Security Features

### Password Protection
- Passwords hashed with bcrypt
- Not visible in database
- Verification done server-side
- Failed attempts logged

### Access Control
- Only quiz creators can export
- Teacher authentication required
- Student data protected
- GDPR compliant

### Data Privacy
- Anonymous attempts supported
- Email optional (if allowed)
- No tracking cookies
- Secure data transmission

---

## 📈 Analytics & Reporting

### Quick Stats on Export Page
- Total attempts count
- Average score
- Completion rate
- Time distribution

### CSV Analysis Tips
1. **Sort by percentage**: Identify top performers
2. **Filter by time**: Find rushed submissions
3. **Group by date**: Track improvement
4. **Pivot tables**: Analyze question difficulty

### Sample Excel Formulas
```excel
Average Score: =AVERAGE(C2:C31)
Pass Rate (≥60%): =COUNTIF(E2:E31,">=60%")/COUNT(E2:E31)
Top 10%: =LARGE(E2:E31,3)
```

---

## ✨ Best Practices

### For Teachers
1. **Set visibility before sharing**: Configure privacy settings first
2. **Test password access**: Verify students can access with password
3. **Export regularly**: Backup results periodically
4. **Review PDF before printing**: Check formatting and correctness
5. **Use unique passwords**: Different password per quiz for security

### For Administrators
1. **Download CSV after deadline**: Wait for all submissions
2. **Keep backup copies**: Save exports to cloud storage
3. **Standardize reporting**: Use consistent format for HOD reports
4. **Monitor large exports**: Check for performance with 100+ attempts

### For Students
1. **Save quiz link**: Bookmark or save in notes
2. **Note password separately**: Don't share passwords
3. **Check attempt count**: Verify if retakes allowed
4. **Complete before deadline**: Avoid last-minute rushes

---

## 🚀 Future Enhancements

Potential future features:
- [ ] Excel export (XLSX format)
- [ ] Email results to students automatically
- [ ] Custom PDF templates
- [ ] Batch export (multiple quizzes)
- [ ] Analytics dashboard
- [ ] Question-level statistics
- [ ] Time-based access control
- [ ] IP whitelisting
- [ ] Integration with LMS platforms

---

## 📞 Support

### Common Issues

**Q: CSV won't open in Excel**
A: Use "Import Data" instead of double-click, set encoding to UTF-8

**Q: PDF shows garbled text**
A: Ensure proper fonts installed, try different PDF viewer

**Q: Students can't access password-protected quiz**
A: Verify password is correct, check for typos, case-sensitive

**Q: Export shows 0 attempts**
A: Check if students submitted quiz, verify quiz ID

**Q: Share link doesn't work**
A: Ensure quiz visibility is not set to private, verify URL is complete

---

## 📝 Summary

Export & Share features provide complete control over quiz distribution and result analysis:

✅ **CSV Export**: Download all student results for analysis
✅ **PDF Export**: Generate printable quizzes with answers
✅ **3 Visibility Levels**: Public, Unlisted, Password-Protected
✅ **Secure Access**: Password hashing and teacher authentication
✅ **Easy Workflow**: One-click export from dashboard
✅ **Professional Format**: Clean CSV and PDF formatting
✅ **Real-time Data**: Always up-to-date attempt information

**Perfect for the scenario**: Teacher downloads CSV of 30 students → sends to HOD for review! 🎓
