# Quiz Taking UI - Visual Guide

## 🎯 Question Type Detection & Display

### How It Works
The system automatically detects whether a question has single or multiple correct answers by checking the `is_correct` flag on each option.

```javascript
// Detection logic
const hasMultipleCorrect = (question) => {
  const correctCount = question.options.filter(opt => opt.is_correct).length
  return correctCount > 1
}
```

---

## 📝 Single Choice Questions

### When Used
- Question has **exactly 1** correct answer
- Example: "What is the capital of France?"

### UI Features
- **Icon**: 📝 Single Choice
- **Input Type**: Radio buttons (○)
- **Selection**: Only one option can be selected at a time
- **Behavior**: Selecting new option automatically deselects previous

### Visual Example
```
┌─────────────────────────────────────────────────────┐
│ 📝 Single Choice                    ✅ Answered      │
│                                                      │
│ What is 2 + 2?                                      │
│                                                      │
│ ┌──────────────────────────────────┐               │
│ │ ○  3                             │               │
│ └──────────────────────────────────┘               │
│                                                      │
│ ┌──────────────────────────────────┐               │
│ │ ◉  4                             │  ← Selected   │
│ └──────────────────────────────────┘               │
│                                                      │
│ ┌──────────────────────────────────┐               │
│ │ ○  5                             │               │
│ └──────────────────────────────────┘               │
│                                                      │
│ ┌──────────────────────────────────┐               │
│ │ ○  6                             │               │
│ └──────────────────────────────────┘               │
└─────────────────────────────────────────────────────┘
```

---

## 📋 Multiple Choice Questions

### When Used
- Question has **2 or more** correct answers
- Example: "Which of these are programming languages? (Select all that apply)"

### UI Features
- **Icon**: 📋 Multiple Choice (Select all that apply)
- **Input Type**: Checkboxes (☐)
- **Selection**: Multiple options can be selected simultaneously
- **Behavior**: Each checkbox toggles independently

### Visual Example
```
┌─────────────────────────────────────────────────────┐
│ 📋 Multiple Choice (Select all that apply)          │
│                                        ✅ Answered   │
│                                                      │
│ Which are fruits? (Select all that apply)          │
│                                                      │
│ ┌──────────────────────────────────┐               │
│ │ ☑  Apple                         │  ← Selected   │
│ └──────────────────────────────────┘               │
│                                                      │
│ ┌──────────────────────────────────┐               │
│ │ ☐  Car                           │               │
│ └──────────────────────────────────┘               │
│                                                      │
│ ┌──────────────────────────────────┐               │
│ │ ☑  Banana                        │  ← Selected   │
│ └──────────────────────────────────┘               │
│                                                      │
│ ┌──────────────────────────────────┐               │
│ │ ☐  Table                         │               │
│ └──────────────────────────────────┘               │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 Visual States

### Selected Option (Both Types)
- **Border**: Purple (2px solid)
- **Background**: Light purple
- **Icon**: Filled (◉ for radio, ☑ for checkbox)

### Unselected Option
- **Border**: Gray (2px solid)
- **Background**: White
- **Icon**: Empty (○ for radio, ☐ for checkbox)

### Hover State
- **Background**: Light purple (same as selected)
- **Cursor**: Pointer
- **Transition**: Smooth 0.3s animation

---

## 📊 Complete Quiz Interface

### Header (Sticky)
```
┌────────────────────────────────────────────────────────────┐
│ 📚 Quiz Title              Question 3 of 10    ⏰ 28:45    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░  30%      │
└────────────────────────────────────────────────────────────┘
```

### Question Card
```
┌────────────────────────────────────────────────────────────┐
│                                                             │
│  📝 Single Choice / 📋 Multiple Choice      ✅ Answered     │
│                                                             │
│  Question text appears here in large, bold font...        │
│                                                             │
│  ┌─────────────────────────────────────────────────┐      │
│  │ Option 1                                         │      │
│  └─────────────────────────────────────────────────┘      │
│                                                             │
│  ┌─────────────────────────────────────────────────┐      │
│  │ Option 2                                         │      │
│  └─────────────────────────────────────────────────┘      │
│                                                             │
│  ┌─────────────────────────────────────────────────┐      │
│  │ Option 3                                         │      │
│  └─────────────────────────────────────────────────┘      │
│                                                             │
│  ┌─────────────────────────────────────────────────┐      │
│  │ Option 4                                         │      │
│  └─────────────────────────────────────────────────┘      │
│                                                             │
│  [ ← Previous ]                           [ Next → ]      │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Last Question (Submit Button)
```
┌────────────────────────────────────────────────────────────┐
│  [ ← Previous ]                    [ ✓ Submit Quiz ]      │
└────────────────────────────────────────────────────────────┘
```

---

## ⏰ Timer States

### Normal (> 5 minutes)
```
┌──────────────┐
│ 🕐  28:45    │  ← Blue background
└──────────────┘
```

### Warning (< 5 minutes)
```
┌──────────────┐
│ 🕐  04:23    │  ← Red background (warning!)
└──────────────┘
```

### Time Expired
```
Auto-submits quiz when timer reaches 00:00
```

---

## 🔄 Resume Feature

### How It Works
1. **Auto-Save Triggers**:
   - Every 5 seconds during quiz
   - When answer is selected
   - When navigating between questions

2. **Saved Data**:
   ```javascript
   {
     studentInfo: { name: "John", email: "john@email.com" },
     answers: {
       0: [1],        // Question 0: Selected option 1
       1: [0, 2],     // Question 1: Selected options 0 and 2
       2: [3]         // Question 2: Selected option 3
     },
     currentQuestion: 2,
     hasStarted: true,
     timeLeft: 1200,
     timestamp: 1699392000000
   }
   ```

3. **Restore Process**:
   - Detect saved data on page load
   - Pre-fill student information
   - Restore all answers
   - Jump to last viewed question
   - Resume timer from saved time

### Visual Indicator
When resuming:
- Student info fields are pre-filled
- User sees "Continue where you left off" message
- Timer shows remaining time
- Progress bar shows correct position

---

## 📱 Responsive Design

### Mobile View
- Single column layout
- Large touch targets (minimum 44x44px)
- Sticky header collapses on scroll
- Bottom navigation buttons stack vertically
- Timer and progress visible on mobile

### Desktop View
- Wider content area (max-width: 1024px)
- Horizontal button layout
- More whitespace for readability
- Hover effects on all interactive elements

---

## ♿ Accessibility Features

### Keyboard Navigation
- Tab through options
- Space/Enter to select
- Arrow keys to navigate (optional)

### Screen Readers
- Clear labels for all inputs
- ARIA attributes for question type
- Status announcements for timer
- Progress updates announced

### Visual Accessibility
- High contrast ratios
- Large, readable fonts
- Clear focus indicators
- Color + icon combinations (not just color)

---

## 🎓 User Flow Example

### Complete Quiz Journey
1. **Start**: Enter name and email → Click "Start Quiz"
2. **Question 1**: Single choice → Select option → Click "Next"
3. **Question 2**: Multiple choice → Select 2 options → Click "Next"
4. **Question 3**: Single choice → Select option → Click "Previous" (change mind)
5. **Question 2**: Change answer → Click "Next" → Click "Next"
6. **Question 4**: Skip (no selection) → Click "Next"
7. **Question 5**: Select option → Click "Submit Quiz"
8. **Results**: See score, breakdown, time taken
9. **Review**: Click "View Answers & Explanations"
10. **Retake**: Click "Retake Quiz" (starts fresh)

### Accidental Close & Resume
1. **During Quiz**: On Question 7, browser closes accidentally
2. **Reopen Link**: Click quiz link again
3. **Resume**: System restores state automatically
4. **Continue**: User on Question 7, all previous answers intact
5. **Timer**: Continues from where it left off

---

## ✨ Summary

**Key Features Implemented:**
- ✅ Automatic question type detection
- ✅ Radio buttons for single-choice
- ✅ Checkboxes for multiple-choice
- ✅ Clear visual indicators
- ✅ Smooth navigation (Previous/Next/Submit)
- ✅ Real-time progress tracking
- ✅ Countdown timer with visual warnings
- ✅ Automatic resume functionality
- ✅ Responsive and accessible design

**The quiz-taking experience is intuitive, feature-rich, and works seamlessly across all devices! 🎉**
