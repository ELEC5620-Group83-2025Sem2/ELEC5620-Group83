# Weekly Report Email - Quick Start Guide

This guide provides quick examples for sending weekly report emails to students and parents.

## Prerequisites

1. Configure AWS SES environment variables (see [AMAZON_SES_EMAIL_SETUP.md](./AMAZON_SES_EMAIL_SETUP.md))
2. Backend server is running
3. Valid authentication tokens for student/parent

## Student Weekly Report Email

### Using cURL

```bash
curl -X POST http://localhost:3000/api/student/weekly-report \
  -H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "your-student-uuid",
    "report_week_start": "2025-10-20",
    "report_week_end": "2025-10-26",
    "email": "student@example.com",
    "send_email": true
  }'
```

### Using JavaScript (Frontend)

```javascript
const generateAndEmailReport = async () => {
  const response = await fetch('http://localhost:3000/api/student/weekly-report', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${studentToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      student_id: 'your-student-uuid',
      report_week_start: '2025-10-20',
      report_week_end: '2025-10-26',
      email: 'student@example.com',
      send_email: true
    })
  });
  
  const data = await response.json();
  console.log('Report generated:', data);
  
  if (data.data.email_sent) {
    console.log('Email sent successfully!');
  }
};
```

### Using Python

```python
import requests

url = "http://localhost:3000/api/student/weekly-report"
headers = {
    "Authorization": "Bearer YOUR_STUDENT_TOKEN",
    "Content-Type": "application/json"
}
data = {
    "student_id": "your-student-uuid",
    "report_week_start": "2025-10-20",
    "report_week_end": "2025-10-26",
    "email": "student@example.com",
    "send_email": True
}

response = requests.post(url, headers=headers, json=data)
print(response.json())
```

## Parent Weekly Report Email

### Using cURL

```bash
curl -X GET "http://localhost:3000/api/parent/children/STUDENT_UUID/weekly-report?report_week_start=2025-10-20&report_week_end=2025-10-26&email=parent@example.com&send_email=true" \
  -H "Authorization: Bearer YOUR_PARENT_TOKEN"
```

### Using JavaScript (Frontend)

```javascript
const getChildReportViaEmail = async (studentId, parentEmail) => {
  const params = new URLSearchParams({
    report_week_start: '2025-10-20',
    report_week_end: '2025-10-26',
    email: parentEmail,
    send_email: 'true'
  });
  
  const response = await fetch(
    `http://localhost:3000/api/parent/children/${studentId}/weekly-report?${params}`,
    {
      headers: {
        'Authorization': `Bearer ${parentToken}`
      }
    }
  );
  
  const data = await response.json();
  console.log('Report generated:', data);
  
  if (data.data.email_sent) {
    console.log('Email sent to parent!');
  }
};
```

### Using Python

```python
import requests

student_id = "student-uuid"
url = f"http://localhost:3000/api/parent/children/{student_id}/weekly-report"
headers = {
    "Authorization": "Bearer YOUR_PARENT_TOKEN"
}
params = {
    "report_week_start": "2025-10-20",
    "report_week_end": "2025-10-26",
    "email": "parent@example.com",
    "send_email": "true"
}

response = requests.get(url, headers=headers, params=params)
print(response.json())
```

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Weekly report generated and emailed successfully",
  "data": {
    "weekly_report": {
      "student_id": "uuid",
      "student_name": "John Smith",
      "report_week_start": "2025-10-20",
      "report_week_end": "2025-10-26",
      "summary": {
        "attendance_rate": 95,
        "average_score": 87,
        "progress_change": "+5%",
        "status": "On Track"
      },
      "courses": [...],
      "assignments": {...},
      "weekly_insight": {...},
      "ai_analysis": {...}
    },
    "email_sent": true,
    "email_details": {
      "success": true,
      "messageId": "01000...",
      "recipient": "student@example.com"
    }
  }
}
```

### Error Response (Email Failed)

```json
{
  "success": true,
  "message": "Weekly report generated, but email failed to send",
  "data": {
    "weekly_report": {...},
    "email_sent": false,
    "email_details": {
      "success": false,
      "error": "Email address is not verified"
    }
  }
}
```

## Request Parameters

### Student Endpoint (POST)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `student_id` | UUID | Yes | The student's unique identifier |
| `report_week_start` | Date | Yes | Start date (YYYY-MM-DD) |
| `report_week_end` | Date | Yes | End date (YYYY-MM-DD) |
| `email` | String | Conditional | Email address (required if send_email is true) |
| `send_email` | Boolean | No | Whether to send email (default: false) |
| `model` | String | No | AI model to use (default: "gpt-5") |

### Parent Endpoint (GET)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `report_week_start` | Date | Yes | Start date (YYYY-MM-DD) |
| `report_week_end` | Date | Yes | End date (YYYY-MM-DD) |
| `email` | String | Conditional | Email address (required if send_email is true) |
| `send_email` | Boolean | No | Whether to send email (default: false) |
| `model` | String | No | AI model to use (default: "gpt-5") |

## Email Format

The weekly report email includes:

### HTML Version
- **Professional header** with date range
- **Weekly Summary** cards with key metrics
- **Study Time Summary** with subject breakdown
- **Course Performance** for each class
- **Assignments** (completed and upcoming)
- **Focus Areas** for next week
- **Weekly Insight** with highlights and recommendations
- **AI Analysis** with strengths and areas for improvement

### Plain Text Version
- All the same information in a readable text format
- Compatible with all email clients

## Common Use Cases

### 1. Generate and Email Report Without Storing

```javascript
// Just generate and send email, don't store in database
const emailWeeklyReport = async (studentId, email) => {
  const response = await fetch('/api/student/weekly-report', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      student_id: studentId,
      report_week_start: '2025-10-20',
      report_week_end: '2025-10-26',
      email: email,
      send_email: true
    })
  });
  
  return await response.json();
};
```

### 2. Generate Report First, Then Email Conditionally

```javascript
// Generate report
const response = await fetch('/api/student/weekly-report', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    student_id: studentId,
    report_week_start: '2025-10-20',
    report_week_end: '2025-10-26',
    send_email: false  // Don't send email yet
  })
});

const data = await response.json();

// Review the report
if (shouldSendEmail(data.data.weekly_report)) {
  // Send email
  await fetch('/api/student/weekly-report', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      student_id: studentId,
      report_week_start: '2025-10-20',
      report_week_end: '2025-10-26',
      email: 'student@example.com',
      send_email: true
    })
  });
}
```

### 3. Batch Email Reports to Multiple Students

```javascript
const emailReportsToClass = async (studentIds, weekStart, weekEnd) => {
  const results = await Promise.allSettled(
    studentIds.map(async (studentId) => {
      // Fetch student email from database
      const studentEmail = await getStudentEmail(studentId);
      
      return fetch('/api/student/weekly-report', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${teacherToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          student_id: studentId,
          report_week_start: weekStart,
          report_week_end: weekEnd,
          email: studentEmail,
          send_email: true
        })
      });
    })
  );
  
  console.log(`Sent ${results.filter(r => r.status === 'fulfilled').length} emails`);
  return results;
};
```

### 4. Schedule Weekly Email Reports

```javascript
// Example using node-cron
import cron from 'node-cron';

// Send weekly reports every Friday at 5 PM
cron.schedule('0 17 * * 5', async () => {
  const students = await getAllActiveStudents();
  const weekStart = getLastWeekStart();
  const weekEnd = getLastWeekEnd();
  
  for (const student of students) {
    try {
      await fetch('/api/student/weekly-report', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${systemToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          student_id: student.id,
          report_week_start: weekStart,
          report_week_end: weekEnd,
          email: student.email,
          send_email: true
        })
      });
      console.log(`Report sent to ${student.name}`);
    } catch (error) {
      console.error(`Failed to send report to ${student.name}:`, error);
    }
  }
});
```

## Testing

### Test Email Sending (Development)

```bash
# Set up test credentials
export AWS_REGION=ap-southeast-2
export AWS_ACCESS_KEY_ID=your_test_key
export AWS_SECRET_ACCESS_KEY=your_test_secret
export AWS_SES_FROM_EMAIL=test@example.com

# Start server
npm run dev

# Send test email
curl -X POST http://localhost:3000/api/student/weekly-report \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "test-uuid",
    "report_week_start": "2025-10-20",
    "report_week_end": "2025-10-26",
    "email": "your-verified-email@example.com",
    "send_email": true
  }'
```

## Troubleshooting

### Email Not Received

1. **Check spam/junk folder**
2. **Verify email address** in SES console (if in Sandbox mode)
3. **Check response** for email_sent: true
4. **Review logs** for error messages
5. **Check AWS SES console** for bounce/complaint reports

### "Email address is not verified" Error

In SES Sandbox mode, both sender and recipient must be verified:
1. Go to AWS SES Console
2. Navigate to "Verified identities"
3. Add and verify the recipient email address

### Permission Denied Error

Check IAM permissions for the AWS credentials:
- Ensure user has `ses:SendEmail` permission
- Use `AmazonSESFullAccess` policy or create custom policy

## Best Practices

1. **Email validation**: Always validate email addresses before sending
2. **Error handling**: Handle email failures gracefully, don't fail entire request
3. **Rate limiting**: Be mindful of SES sending limits (14 emails/second in Sandbox)
4. **Batch operations**: Use Promise.allSettled() for batch emails to handle individual failures
5. **Monitoring**: Monitor AWS SES console for bounce rates and complaints
6. **Testing**: Test with various email providers (Gmail, Outlook, etc.)

## Support

For issues:
- AWS SES: See [AMAZON_SES_EMAIL_SETUP.md](./AMAZON_SES_EMAIL_SETUP.md)
- API Errors: Check backend logs
- Email not delivered: Check AWS SES console logs

---

**Related Documentation:**
- [Amazon SES Setup Guide](./AMAZON_SES_EMAIL_SETUP.md)
- [Backend README](./backend/README.md)

