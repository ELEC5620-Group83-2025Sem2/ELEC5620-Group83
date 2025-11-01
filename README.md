# HSC Power - ELEC5620 Group 83

**Empowering Your Academic Journey with Smart Technology**

[![CI/CD](https://github.com/YOUR_USERNAME/ELEC5620-Group83/actions/workflows/CICD.yml/badge.svg)](https://github.com/YOUR_USERNAME/ELEC5620-Group83/actions)
[![Tests](https://img.shields.io/badge/tests-245%20passing-brightgreen.svg)](./TESTS_SUMMARY.md)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](./LICENSE)

HSC Power is a comprehensive web-based platform designed for HSC students to excel in their studies with intelligent tools, resources, and collaborative learning features.

## 🚀 Project Overview

This full-stack application combines modern web technologies to deliver a seamless educational experience:
- **Frontend**: React 19 with Vite for blazing-fast development
- **Backend**: Node.js with Express.js for robust API services
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **AI Features**: OpenAI integration for intelligent assistance
- **Architecture**: RESTful API design with modular structure
- **Testing**: Comprehensive test suite with 60%+ coverage
- **CI/CD**: Automated testing and deployment with GitHub Actions

## 📁 Project Structure

```
ELEC5620-Group83/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── App.jsx           # Main landing page component
│   │   ├── App.css           # Styling for the application
│   │   ├── main.jsx          # Application entry point
│   │   └── index.css         # Global styles
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite configuration
│   └── package.json          # Frontend dependencies
│
└── backend/           # Node.js + Express.js server
    ├── routes/               # API route handlers
    │   └── api.js
    ├── controllers/          # Business logic
    │   └── exampleController.js
    ├── middleware/           # Custom middleware
    │   └── logger.js
    ├── server.js            # Express server setup
    ├── .env                 # Environment variables (not in git)
    └── package.json         # Backend dependencies
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library with latest features
- **Vite 7** - Next-generation frontend tooling
- **ES6+ Modules** - Modern JavaScript syntax
- **CSS3** - Custom styling with animations and gradients

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5** - Fast, minimalist web framework
- **CORS** - Cross-Origin Resource Sharing support
- **dotenv** - Environment variable management
- **nodemon** - Auto-reload during development

## 🚦 Getting Started

### Prerequisites
- Node.js (v20.14.0 or higher)
- npm (v10.7.0 or higher)

### Installation

1. **Clone the repository**
   ```bash
   cd ELEC5620-Group83
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

### Running the Application

#### Option 1: Development Mode (Recommended)

**Terminal 1 - Start Backend Server:**
```bash
cd backend
npm run dev
```
Server will run on `http://localhost:3000` with auto-reload

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
Application will run on `http://localhost:5173`

#### Option 2: Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📡 API Endpoints

### Base URL: `http://localhost:3000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API welcome message with endpoints list |
| GET | `/api/health` | Server health check |
| GET | `/api/examples` | Example API route |

### Example Request:
```bash
curl http://localhost:3000/api/health
```

### Example Response:
```json
{
  "status": "OK",
  "message": "HSC Power Server is running"
}
```

## 🎨 Features

### Current Features
- ✅ Modern, responsive landing page
- ✅ Real-time server status indicator
- ✅ Beautiful gradient UI with animations
- ✅ Feature showcase with grid layout
- ✅ RESTful API architecture
- ✅ Request logging middleware
- ✅ CORS-enabled API

### Planned Features
- 📚 Study resource management
- 🎯 Progress tracking system
- 👥 Collaborative learning tools
- 🤖 AI-powered study assistance
- 📊 Performance analytics dashboard

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
NODE_ENV=development
```

### Frontend Configuration

The frontend is configured to connect to the backend at `http://localhost:5000`. To change this, update the API URLs in the frontend source files.

## 📝 Scripts

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Scripts
```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
npm test         # Run tests (to be implemented)
```

## 🐛 Troubleshooting

### Server Not Starting?

1. Check if port 3000 is already in use:
   ```bash
   lsof -i :3000
   ```

2. Kill the process or change the PORT in `.env`

   **Note:** On macOS, port 5000 is often used by AirPlay Receiver. We recommend using port 3000.

3. Make sure all dependencies are installed:
   ```bash
   cd backend && npm install
   ```

### Frontend Can't Connect to Backend?

1. Ensure backend server is running on port 3000
2. Check browser console for CORS errors
3. Verify the API URL in frontend code matches your backend

### Module Import Errors?

Both projects use ES6 modules (`"type": "module"`). Make sure:
- Import statements use `.js` extensions
- File extensions match the actual files

## 👥 Team

**ELEC5620 Group 83**
- University of Sydney
- Semester 1, 2025

## 📄 License

ISC License - See individual package.json files for details.

## 🔗 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Node.js Documentation](https://nodejs.org/)

---

**Built with ❤️ by Group 83**
