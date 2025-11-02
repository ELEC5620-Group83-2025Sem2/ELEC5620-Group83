# Weekly Report Email - Quick Reference Card

## 🚀 Quick Setup (5 minutes)

1. **Install Package** (Already done ✅)
   ```bash
   npm install @aws-sdk/client-ses
   ```

2. **Add to `.env`**
   ```env
   AWS_REGION=ap-southeast-2
   AWS_ACCESS_KEY_ID=your_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_here
   AWS_SES_FROM_EMAIL=noreply@yourschool.edu.au
   ```

3. **Verify Email in AWS SES**
   - Go to [AWS SES Console](https://console.aws.amazon.com/ses/)
   - Click "Verified identities" → "Create identity"
   - Enter sender email → Verify via link in email

4. **Test**
   ```bash
   curl -X POST http://localhost:3000/api/student/weekly-report \
     -H "Authorization: Bearer TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"student_id":"uuid","report_week_start":"2025-10-20","report_week_end":"2025-10-26","email":"test@example.com","send_email":true}'
   ```

## 📧 API Quick Reference

### Student Email
```javascript
POST /api/student/weekly-report
Body: {
  "student_id": "uuid",
  "report_week_start": "2025-10-20",
  "report_week_end": "2025-10-26",
  "email": "student@example.com",
  "send_email": true
}
```

### Parent Email
```javascript
GET /api/parent/children/:student_id/weekly-report?report_week_start=2025-10-20&report_week_end=2025-10-26&email=parent@example.com&send_email=true
```

## 🔧 Environment Variables

| Variable | Example | Required |
|----------|---------|----------|
| `AWS_REGION` | `ap-southeast-2` | Yes |
| `AWS_ACCESS_KEY_ID` | `AKIA...` | Yes |
| `AWS_SECRET_ACCESS_KEY` | `wJalrXUt...` | Yes |
| `AWS_SES_FROM_EMAIL` | `noreply@school.edu.au` | Yes |

## 🐛 Common Issues

| Error | Solution |
|-------|----------|
| "Email address is not verified" | Verify email in SES console (Sandbox mode) |
| "AWS_REGION is required" | Add to `.env` file |
| "User is not authorized" | Add `AmazonSESFullAccess` to IAM user |
| Email not received | Check spam folder / Verify recipient in SES |

## 📚 Full Documentation

- **Setup Guide**: [AMAZON_SES_EMAIL_SETUP.md](./AMAZON_SES_EMAIL_SETUP.md)
- **Usage Guide**: [WEEKLY_REPORT_EMAIL_GUIDE.md](./WEEKLY_REPORT_EMAIL_GUIDE.md)
- **Summary**: [EMAIL_INTEGRATION_SUMMARY.md](./EMAIL_INTEGRATION_SUMMARY.md)

## ✨ Email Features

✅ Professional HTML template  
✅ Plain text alternative  
✅ Weekly summary dashboard  
✅ Study time breakdown  
✅ Course performance  
✅ Assignment tracking  
✅ AI-powered insights  
✅ Focus areas  
✅ Responsive design  

## 💰 Cost

**Free Tier**: 62,000 emails/month  
**After Free Tier**: $0.10 per 1,000 emails

For 1,000 students weekly: **$0/month** (within free tier)

