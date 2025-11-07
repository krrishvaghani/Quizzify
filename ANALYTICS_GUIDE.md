# Analytics & Reports Feature Guide

## Overview
The Analytics & Reports feature provides comprehensive insights into quiz performance, helping teachers identify problematic questions and understand student performance patterns.

## Features

### 1. **Per-Quiz Analytics**
- **Average Score**: Mean score across all attempts
- **Median Score**: Middle value in the score distribution
- **Standard Deviation**: Measure of score variability
- **Total Attempts**: Number of times the quiz has been taken
- **Average Time**: Average time taken to complete the quiz

### 2. **Per-Question Metrics**
Each question displays:
- **Correct Percentage**: % of students who answered correctly
- **Skip Rate**: % of students who didn't answer the question
- **Attempts Count**: Total number of attempts for this question
- **Discrimination Index**: Measures how well the question differentiates between high and low performers

### 3. **Discrimination Indicator**
- **Formula**: Compares top 27% performers vs bottom 27% performers
- **Interpretation**:
  - ≥ 0.3: Excellent discrimination
  - 0.2 - 0.29: Good discrimination
  - < 0.2: Poor discrimination (question doesn't differentiate well)

### 4. **Problematic Question Identification**
Questions are flagged as problematic when:
- Correct percentage < 40% (configurable)
- Skip rate > 20%
- Discrimination index < 0.2 (with sufficient attempts)

### 5. **Action Suggestions**
The system provides automatic suggestions:
- "Consider rewording or removing this question" (correct% < 30%)
- "Review question clarity and answer options" (correct% 30-40%)
- "Question may be too difficult or unclear" (skip rate > 30%)
- "Question doesn't discriminate well between strong and weak students" (discrimination < 0.1)

## User Interface

### Analytics Dashboard
Access via: Dashboard → Quiz Card → "Analytics" button

#### Components:

1. **Summary Cards**
   - Total Attempts
   - Average Score (with median)
   - Average Time
   - Problematic Questions Count

2. **Score Distribution Chart**
   - Bar chart showing score frequency
   - Visual representation of score spread

3. **Score Trend Over Time**
   - Line chart showing average scores by date
   - Attempt count per day

4. **Date Range Filter**
   - Filter analytics by date range
   - Start and end date selectors
   - Clear filter option

5. **Per-Question Table**
   - Sortable columns
   - Color-coded metrics (green/yellow/red)
   - Issue indicators and suggestions
   - Question preview (truncated)

6. **Problematic Questions Alert**
   - Highlighted warning for questions needing attention
   - Summary of issues

### Export Options

#### CSV Export
- Contains all attempt-level data
- Columns: Student name, email, score, percentage, time taken, correct/incorrect/unanswered counts, submission date
- Useful for spreadsheet analysis

#### PDF Export
- Professional formatted report
- Includes:
  - Summary statistics table
  - Per-question analysis table
  - Detailed problematic questions section with suggestions
  - Metrics interpretation guide

## API Endpoints

### Get Quiz Analytics
```
GET /quizzes/{quiz_id}/analytics
Query Parameters:
  - start_date (optional): Filter attempts from this date
  - end_date (optional): Filter attempts until this date
```

**Response Structure:**
```json
{
  "quiz_id": "string",
  "quiz_title": "string",
  "total_questions": 10,
  "total_attempts": 50,
  "summary": {
    "score": {
      "mean": 7.5,
      "median": 8.0,
      "std_dev": 1.2,
      "max": 10,
      "min": 3
    },
    "percentage": {
      "mean": 75.0,
      "median": 80.0,
      "std_dev": 12.0,
      "max": 100,
      "min": 30
    },
    "time_taken": {
      "mean": 450,
      "median": 420,
      "std_dev": 60,
      "max": 600,
      "min": 300,
      "average_formatted": "7 minutes 30 seconds"
    },
    "problematic_questions_count": 2
  },
  "question_metrics": [
    {
      "question_index": 0,
      "question_text": "What is...",
      "correct_count": 40,
      "incorrect_count": 8,
      "skipped_count": 2,
      "total_attempts": 50,
      "correct_percentage": 80.0,
      "skip_rate": 4.0,
      "discrimination_index": 0.45,
      "issues": [],
      "suggestions": [],
      "is_problematic": false
    }
  ],
  "problematic_questions": [...],
  "score_distribution": [
    {"score": 5, "count": 3},
    {"score": 6, "count": 5}
  ],
  "attempts_over_time": [
    {
      "date": "2025-11-07",
      "attempts_count": 12,
      "average_score": 78.5
    }
  ]
}
```

### Export CSV
```
GET /quizzes/{quiz_id}/analytics/export/csv
Returns: CSV file download
```

### Export PDF
```
GET /quizzes/{quiz_id}/analytics/export/pdf
Returns: PDF file download
```

## Technical Implementation

### Backend (Python/FastAPI)
- **Statistics Calculation**: Uses Python's `statistics` module for mean, median, and standard deviation
- **Discrimination Index**: Custom algorithm comparing top and bottom quartile performers
- **PDF Generation**: ReportLab library for professional PDF reports
- **CSV Generation**: Python's built-in csv module

### Frontend (React)
- **Routing**: React Router for navigation
- **State Management**: React hooks (useState, useEffect)
- **Charts**: Custom CSS-based charts (simple bar and line charts)
- **Export**: Axios with blob response type for file downloads

## Usage Examples

### For Teachers

1. **Reviewing Overall Performance**
   - Check average score and median to understand class performance
   - Look at standard deviation to see score variability
   - High variability might indicate mixed understanding

2. **Identifying Problematic Questions**
   - Red flags in the per-question table indicate issues
   - Focus on questions with low correct% or high skip rate
   - Use suggestions to improve questions

3. **Improving Quiz Quality**
   - Questions with low discrimination might be too easy or too hard
   - Consider editing questions that don't effectively test understanding
   - Use problematic questions section for quick access to issues

4. **Reporting to HODs**
   - Export PDF for professional reports
   - Export CSV for detailed data analysis in Excel
   - Use date filters to generate period-specific reports

### Color Coding
- **Green**: Good performance (≥70% correct, ≥0.3 discrimination)
- **Yellow**: Moderate (40-69% correct, 0.2-0.29 discrimination)
- **Red**: Needs attention (<40% correct, <0.2 discrimination)

## Configuration

### Thresholds (in backend code)
You can modify these in `backend/main.py`:
```python
# Problematic question thresholds
CORRECT_PERCENTAGE_THRESHOLD = 40  # Flag if below
SKIP_RATE_THRESHOLD = 20  # Flag if above
DISCRIMINATION_THRESHOLD = 0.2  # Flag if below
```

### Discrimination Index Calculation
The system uses the top and bottom 27% of performers (a standard educational testing practice). This can be adjusted in the `calculate_discrimination_index` function.

## Best Practices

1. **Wait for Sufficient Data**: Discrimination index requires at least 10 attempts for meaningful results
2. **Regular Review**: Check analytics after every 5-10 new attempts
3. **Action on Suggestions**: Address flagged questions to improve quiz quality
4. **Track Trends**: Use date filters to see if performance improves over time
5. **Export Regularly**: Keep records for comparison and reporting

## Troubleshooting

### No Data Showing
- Ensure students have submitted attempts
- Check date range filters aren't too restrictive

### Discrimination Index Shows 0
- Need at least 10 attempts for accurate calculation
- Fewer attempts will show 0 or unreliable values

### Export Not Working
- Check backend server is running
- Verify authentication token is valid
- Check browser console for errors

## Future Enhancements

Potential additions:
- Time-per-question analysis
- Student cohort comparison
- Historical trend visualization
- Automated email reports
- Custom threshold configuration in UI
- Question difficulty prediction
- Performance correlation analysis
