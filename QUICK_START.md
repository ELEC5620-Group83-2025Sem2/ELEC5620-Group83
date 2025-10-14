# HSC Power - Quick Start Guide

Get up and running with HSC Power in less than 5 minutes! 🚀

## ⚡ Quick Setup

### 1. Start the Backend Server

Open a terminal and run:

```bash
cd backend
npm run dev
```

You should see:
```
🚀 HSC Power Server is running on http://localhost:3000
📡 API Health: http://localhost:3000/api/health
```

### 2. Start the Frontend

Open a **new terminal** and run:

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 3. Open Your Browser

Navigate to: **http://localhost:5173**

You should see the HSC Power landing page with:
- ✅ Beautiful gradient hero section
- ✅ Six feature cards
- ✅ System status indicator showing "HSC Power Server is running"

## 🎯 Test the API

Open a new terminal and test the endpoints:

```bash
# Health check
curl http://localhost:3000/api/health

# Welcome message
curl http://localhost:3000/

# Example endpoint
curl http://localhost:3000/api/examples
```

## 🔥 Hot Reload

Both frontend and backend support hot reload:
- **Frontend**: Edit files in `frontend/src/` and see changes instantly
- **Backend**: Edit files in `backend/` and nodemon will restart the server

## 📱 Try It Out

### Edit the Landing Page

1. Open `frontend/src/App.jsx`
2. Change the title text or add a new feature card
3. Save the file
4. Watch it update in your browser instantly!

### Add a New API Endpoint

1. Open `backend/routes/api.js`
2. Add a new route:
   ```javascript
   router.get('/hello', (req, res) => {
     res.json({ message: 'Hello from HSC Power!' });
   });
   ```
3. Save and test:
   ```bash
   curl http://localhost:3000/api/hello
   ```

## ❓ Common Issues

### Port 5000 Already in Use?

On macOS, AirPlay Receiver uses port 5000. That's why we use **port 3000** for the backend.

If port 3000 is also busy:
1. Find what's using it: `lsof -i :3000`
2. Kill it: `kill -9 <PID>`
3. Or change the port in `backend/.env`

### Server Status Shows "Server offline"?

1. Make sure backend is running on port 3000
2. Check the terminal for error messages
3. Restart the backend: `npm run dev`

### Dependencies Not Installed?

Run these commands:
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

## 🎨 Customization

### Change the Theme Colors

Edit `frontend/src/App.css` and update the gradient:

```css
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* Change these colors to your liking! */
}
```

### Add Your Own Features

The landing page is just the starting point! Add:
- Navigation bar
- User authentication
- Study materials
- Practice quizzes
- Progress tracking
- And much more!

## 📚 Next Steps

1. Read the full [README.md](./README.md)
2. Explore the [frontend README](./frontend/README.md)
3. Check out the [backend README](./backend/README.md)
4. Start building your features!

## 🆘 Need Help?

- Check the troubleshooting sections in the README files
- Look at the example code in `controllers/` and `routes/`
- The server logs will show you any errors

---

**Happy Coding! 🎓**

ELEC5620 Group 83

