# HSC Power - Frontend

Modern React application built with Vite for the HSC Power platform.

## 🎨 Features

- Beautiful, responsive landing page
- Real-time server status monitoring
- Modern gradient UI with smooth animations
- Feature showcase with grid layout
- Mobile-first responsive design

## 🛠️ Tech Stack

- **React 19** - Latest React with modern hooks
- **Vite 7** - Lightning-fast build tool
- **CSS3** - Custom styling with animations
- **ES6+ Modules** - Modern JavaScript

## 📦 Installation

```bash
npm install
```

## 🚀 Development

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── App.jsx           # Main component with landing page
│   ├── App.css           # Component styles
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies and scripts
```

## 🔌 API Integration

The frontend connects to the backend API at `http://localhost:3000`. The landing page includes a health check that displays the server status in real-time.

To change the API URL, update the fetch calls in `App.jsx`:

```javascript
fetch('http://localhost:3000/api/health')
```

## 🎨 Styling

The application uses custom CSS with:
- CSS Grid for layout
- Flexbox for component alignment
- CSS animations and transitions
- Responsive breakpoints for mobile devices
- Gradient backgrounds and modern design

## 📱 Responsive Design

Breakpoints:
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 🔧 Configuration

### Vite Configuration

The `vite.config.js` file includes:
- React plugin for Fast Refresh
- Build optimizations
- Development server settings

### Environment Variables

Create a `.env` file if you need custom configuration:

```env
VITE_API_URL=http://localhost:3000
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
```

## 🚦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 📦 Dependencies

### Production
- `react` - UI library
- `react-dom` - React renderer

### Development
- `@vitejs/plugin-react` - React plugin for Vite
- `vite` - Build tool and dev server

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is busy, Vite will automatically try the next available port. Check the terminal output for the actual URL.

### Backend Connection Failed

Make sure:
1. Backend server is running on port 3000
2. CORS is properly configured on backend
3. No firewall blocking localhost connections

**Note:** The default backend port is 3000 (not 5000) because macOS uses port 5000 for AirPlay Receiver.

### Build Errors

Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 Notes

- The project uses ES modules (`"type": "module"`)
- Hot Module Replacement (HMR) is enabled for fast development
- All imports use explicit `.jsx` extensions where needed

---

Part of HSC Power - ELEC5620 Group 83

