# HSC Power - Backend API

Node.js + Express.js backend server for the HSC Power platform.

## 🚀 Features

- RESTful API architecture
- CORS enabled for frontend integration
- Request logging middleware
- Modular route structure
- Environment variable configuration
- Auto-reload with nodemon in development

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js 5** - Web framework
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables
- **nodemon** - Development auto-reload

## 📦 Installation

```bash
npm install
```

## 🚀 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will run on `http://localhost:3000` by default.

## 📁 Project Structure

```
backend/
├── routes/
│   └── api.js                 # API route handlers
├── controllers/
│   └── exampleController.js   # Business logic
├── middleware/
│   └── logger.js              # Request logging
├── server.js                  # Express app setup
├── .env                       # Environment variables (not in git)
├── .env.example               # Environment template
└── package.json               # Dependencies and scripts
```

## 📡 API Endpoints

### Root Endpoint
```
GET /
```
Returns welcome message and available endpoints.

**Response:**
```json
{
  "message": "Welcome to HSC Power API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "examples": "/api/examples"
  }
}
```

### Health Check
```
GET /api/health
```
Check if the server is running.

**Response:**
```json
{
  "status": "OK",
  "message": "HSC Power Server is running"
}
```

### Example Route
```
GET /api/examples
```
Example API endpoint.

**Response:**
```json
{
  "message": "Example API route"
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3000
NODE_ENV=development
```

Available variables:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

**Note:** Port 5000 is often used by macOS AirPlay Receiver, so we use port 3000 by default.

### CORS Configuration

CORS is enabled for all origins in development. For production, update the CORS configuration in `server.js`:

```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

## 🔌 Middleware

### Logger Middleware

Logs all incoming requests with method, URL, and timestamp.

**Location:** `middleware/logger.js`

**Usage:**
```javascript
import { logger } from './middleware/logger.js';
app.use(logger);
```

### Error Handling

Global error handler catches all errors and returns a 500 response.

**Location:** `server.js`

## 🏗️ Adding New Routes

### 1. Create a Route File

Create a new file in `routes/`:

```javascript
// routes/users.js
import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ users: [] });
});

export default router;
```

### 2. Register the Route

Add it to `server.js`:

```javascript
import userRoutes from './routes/users.js';
app.use('/api/users', userRoutes);
```

## 🎯 Adding Controllers

Create controller functions in `controllers/`:

```javascript
// controllers/userController.js
export const getUsers = async (req, res) => {
  try {
    // Your logic here
    res.json({ success: true, users: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

Use in routes:

```javascript
import { getUsers } from '../controllers/userController.js';
router.get('/users', getUsers);
```

## 🚦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm test` | Run tests (to be implemented) |

## 📦 Dependencies

### Production
- `express` - Web framework
- `cors` - CORS middleware
- `dotenv` - Environment variables

### Development
- `nodemon` - Auto-reload on file changes

## 🐛 Troubleshooting

### Port Already in Use

Find and kill the process:
```bash
lsof -i :3000
kill -9 <PID>
```

Or change the port in `.env`:
```env
PORT=3001
```

**macOS Note:** Port 5000 is commonly used by AirPlay Receiver. If you need to use port 5000, disable AirPlay Receiver in System Settings > General > AirDrop & Handoff.

### Module Import Errors

This project uses ES6 modules. Make sure:
- `"type": "module"` is in package.json
- Import statements include `.js` extensions
- Use `import/export` instead of `require/module.exports`

### CORS Errors

If frontend can't connect:
1. Check backend is running
2. Verify CORS is enabled in `server.js`
3. Check browser console for specific error
4. Ensure frontend URL matches CORS configuration

### Server Won't Start

1. Check Node.js version (should be 20.14.0+)
2. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. Check for syntax errors in server.js
4. Verify .env file exists and is valid

## 🔒 Security Notes

- Never commit `.env` file to git
- Use environment variables for sensitive data
- Implement authentication for protected routes
- Validate and sanitize all user inputs
- Use HTTPS in production

## 📝 Best Practices

- Keep routes thin, move logic to controllers
- Use middleware for cross-cutting concerns
- Handle errors consistently
- Log important events and errors
- Write descriptive commit messages
- Comment complex logic

## 🧪 Testing

(To be implemented)

```bash
npm test
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

Part of HSC Power - ELEC5620 Group 83

