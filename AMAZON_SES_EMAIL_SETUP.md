# Amazon SES Email Integration for Weekly Reports

This document explains how to configure and use Amazon SES (Simple Email Service) for sending weekly report emails to students and parents.

## Overview

The weekly report system has been enhanced to send beautifully formatted email reports using Amazon SES. Both students and parents can receive weekly academic reports via email.

## Prerequisites

1. **AWS Account**: You need an active AWS account
2. **Amazon SES Access**: Access to Amazon SES service
3. **Verified Email Addresses**: At least one verified sender email address in SES

## AWS SES Setup

### Step 1: Set Up Amazon SES

1. **Sign in to AWS Console**
   - Go to [AWS Console](https://console.aws.amazon.com/)
   - Navigate to Amazon SES (Simple Email Service)

2. **Verify Your Sender Email Address**
   - In the SES console, go to "Verified identities"
   - Click "Create identity"
   - Choose "Email address"
   - Enter the email address you want to send from (e.g., `noreply@yourschool.edu.au`)
   - Click "Create identity"
   - Check your email for a verification link and click it

3. **Request Production Access (Optional but Recommended)**
   - By default, SES is in "Sandbox" mode
   - In Sandbox mode, you can only send to verified email addresses
   - To send to any email address, request production access:
     - Go to "Account dashboard" in SES
     - Click "Request production access"
     - Fill out the form explaining your use case
   - Note: For testing, Sandbox mode is sufficient if you verify recipient emails

4. **Create IAM Access Keys**
   - Go to IAM (Identity and Access Management) in AWS Console
   - Create a new user or use existing one
   - Attach the `AmazonSESFullAccess` policy (or create a custom policy with minimal permissions)
   - Create access keys for this user
   - Save the **Access Key ID** and **Secret Access Key** securely

### Step 2: Configure Environment Variables

Add the following environment variables to your `.env` file in the `backend` directory:

```env
# AWS SES Configuration
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_secret_access_key_here
AWS_SES_FROM_EMAIL=noreply@yourschool.edu.au
```

**Environment Variable Details:**

- `AWS_REGION`: The AWS region where your SES is configured (e.g., `us-east-1`, `ap-southeast-2` for Sydney)
- `AWS_ACCESS_KEY_ID`: Your IAM user's access key ID
- `AWS_SECRET_ACCESS_KEY`: Your IAM user's secret access key
- `AWS_SES_FROM_EMAIL`: The verified sender email address

### Step 3: Test Your Configuration

You can test the SES configuration by generating and sending a test weekly report:

```bash
# Start the backend server
cd backend
npm start
```

## API Usage

### Student Weekly Report with Email

**Endpoint:** `POST /api/student/weekly-report`

**Headers:**
```json
{
  "Authorization": "Bearer <student_token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "student_id": "uuid-of-student",
  "report_week_start": "2025-10-20",
  "report_week_end": "2025-10-26",
  "model": "gpt-5",
  "email": "student@example.com",
  "send_email": true
}
```

**Parameters:**
- `student_id`: UUID of the student (required)
- `report_week_start`: Start date of the report week in YYYY-MM-DD format (required)
- `report_week_end`: End date of the report week in YYYY-MM-DD format (required)
- `model`: AI model to use for report generation (optional, default: "gpt-5")
- `email`: Email address to send the report to (optional, required if send_email is true)
- `send_email`: Boolean flag to enable email sending (optional, default: false)

**Response:**
```json
{
  "success": true,
  "message": "Weekly report generated and emailed successfully",
  "data": {
    "weekly_report": { /* full report object */ },
    "email_sent": true,
    "email_details": {
      "success": true,
      "messageId": "01000...",
      "recipient": "student@example.com"
    }
  }
}
```

### Parent Weekly Report with Email

**Endpoint:** `GET /api/parent/children/:student_id/weekly-report`

**Headers:**
```json
{
  "Authorization": "Bearer <parent_token>"
}
```

**Query Parameters:**
```
?report_week_start=2025-10-20
&report_week_end=2025-10-26
&model=gpt-5
&email=parent@example.com
&send_email=true
```

**Response:** Same format as student endpoint

## Email Features

### HTML Email Template

The email includes:
- **Professional header** with school branding area
- **Weekly summary** with key metrics (attendance, scores, progress, status)
- **Study time breakdown** by subject
- **Course performance** details for each enrolled class
- **Assignment tracking** (completed and upcoming)
- **Focus areas** for next week
- **AI-powered insights** and recommendations
- **Responsive design** that works on mobile and desktop

### Plain Text Alternative

Every email includes a plain text version for email clients that don't support HTML.

### Email Validation

The system validates email addresses before sending to prevent errors:
- Checks for valid email format
- Verifies required AWS credentials are configured
- Provides clear error messages if configuration is missing

## Troubleshooting

### Common Issues

1. **"AWS_REGION is required in environment variables"**
   - **Solution**: Add `AWS_REGION` to your `.env` file

2. **"Email sending failed: User 'arn:aws:iam::...' is not authorized"**
   - **Solution**: Check that your IAM user has the correct SES permissions
   - Ensure the `AmazonSESFullAccess` policy is attached to your IAM user

3. **"Email address is not verified"** (in Sandbox mode)
   - **Solution**: 
     - Verify the sender email address in SES console
     - If in Sandbox mode, also verify recipient email addresses
     - Or request production access

4. **Email not received**
   - Check spam/junk folders
   - Verify the email address is correct
   - Check SES sending statistics in AWS console for bounce/complaint rates
   - Review CloudWatch logs for detailed error messages

5. **"MessageRejected: Email address is not verified"**
   - **Solution**: In SES Sandbox mode, you must verify both sender AND recipient emails
   - Verify recipient email in SES console or request production access

### Testing in Sandbox Mode

If you're in SES Sandbox mode, you need to verify recipient emails:

1. Go to SES console → "Verified identities"
2. Click "Create identity"
3. Choose "Email address"
4. Enter the test recipient email
5. Click "Create identity"
6. The recipient will receive a verification email
7. Click the verification link in the email

Now you can send test emails to this address.

### Checking Email Delivery Status

1. **AWS Console Method:**
   - Go to Amazon SES console
   - Navigate to "Sending statistics"
   - View delivery, bounce, and complaint metrics

2. **CloudWatch Logs:**
   - Go to CloudWatch in AWS Console
   - Check logs for detailed delivery information

3. **Application Logs:**
   - Check backend console output for email sending confirmation
   - Look for `Email sent successfully:` messages with `messageId`

## Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use IAM roles** when deploying to AWS EC2/ECS instead of access keys
3. **Create a dedicated IAM user** for SES with minimal required permissions
4. **Rotate access keys** regularly
5. **Monitor SES usage** to detect unauthorized access
6. **Use environment-specific credentials** (different keys for dev/staging/production)

### Minimal IAM Policy for SES

Instead of `AmazonSESFullAccess`, you can use a minimal policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
```

## Cost Considerations

**Amazon SES Pricing (as of 2025):**
- First 62,000 emails per month: **FREE** (if sent from EC2)
- After that: $0.10 per 1,000 emails
- Data transfer: Standard AWS rates apply

For a school with 1,000 students:
- Weekly reports to all students: ~4,000 emails/month
- Cost: **$0** (within free tier)

## Production Deployment Checklist

- [ ] Request and receive SES production access
- [ ] Verify sender domain (recommended) or email address
- [ ] Set up SPF, DKIM, and DMARC records for your domain
- [ ] Configure bounce and complaint handling
- [ ] Set up CloudWatch alarms for bounce rates
- [ ] Use IAM roles instead of access keys (if deploying to AWS)
- [ ] Test email delivery to various email providers (Gmail, Outlook, etc.)
- [ ] Monitor sending reputation in SES console
- [ ] Configure SNS notifications for bounces and complaints (optional)

## Support

For issues related to:
- **AWS SES**: Contact AWS Support or refer to [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- **Application Email Integration**: Check backend logs and contact your development team

## Additional Resources

- [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/)
- [SES Sending Authorization](https://docs.aws.amazon.com/ses/latest/dg/sending-authorization.html)
- [SES Email Sending Best Practices](https://docs.aws.amazon.com/ses/latest/dg/best-practices.html)
- [Moving Out of SES Sandbox](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html)

