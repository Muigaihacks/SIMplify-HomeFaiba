# SIMplify HomeFaiba - WiFi Sales Management System

A React-based frontend application for managing Home Fiber/WiFi sales for SIMplify, a Kenyan telco dealer management platform. This system allows field agents to digitize application forms and enables dealers to manage teams, track sales, and handle commission reconciliation.

## 🎯 Project Overview

SIMplify HomeFaiba is a new vertical for the SIMplify platform that automates the sales and tracking process for Home Fiber/WiFi services. The system helps:

- **Field Agents**: Digitize application forms, track installations, and view package information
- **Dealers**: Manage sales teams, track sales records, calculate commissions, and reconcile with telcos

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Bootstrap 5.3.3
- **Icons**: FontAwesome 7.1.0
- **Routing**: React Router DOM 6.30.3
- **Mock API**: JSON-Server (for development)

## 📋 Features

### For Field Agents:
1. **Digital Application Form** - Multi-step form for customer enrollment
2. **Package Comparison Tool** - Visual comparison of WiFi packages
3. **Installation Tracker** - Track installation progress for customers
4. **Dashboard** - Overview of personal sales statistics

### For Dealers:
1. **Salesmen Directory** - Manage and view all field agents
2. **Sales Records** - Searchable dashboard of all applications
3. **Commission Dashboard** - Calculate and track commissions per agent
4. **Performance Leaderboard** - Rank agents by sales and commission
5. **Dashboard** - Overview of dealer statistics

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (or 20+ recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Muigaihacks/SIMplify-HomeFaiba.git
   cd SIMplify-HomeFaiba
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the mock API server** (in a separate terminal)
   ```bash
   # From the root directory
   npm install -g json-server
   json-server --watch db.json --port 3000
   ```
   
   Or use the npm script:
   ```bash
   cd frontend
   npm run api
   ```

4. **Start the development server**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in the terminal)

## 📁 Project Structure

```
SIMplify-HomeFaiba/
├── db.json                 # Mock API data (JSON-Server)
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Navbar.tsx
│   │   │   └── Toast.tsx
│   │   ├── contexts/       # React contexts
│   │   │   └── AppContext.tsx
│   │   ├── pages/          # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ApplicationForm.tsx
│   │   │   ├── SalesmenDirectory.tsx
│   │   │   ├── SalesRecords.tsx
│   │   │   ├── CommissionsDashboard.tsx
│   │   │   ├── Leaderboard.tsx
│   │   │   ├── PackagesComparison.tsx
│   │   │   └── InstallationsTracker.tsx
│   │   ├── services/       # API service layer
│   │   │   └── api.ts
│   │   ├── types/          # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   └── package.json
└── README.md
```

## 🔌 API Integration

The application is built to work with a REST API. Currently, it uses JSON-Server for development. To connect to your backend API:

1. Update the `API_BASE_URL` in `frontend/src/services/api.ts`
2. Or set the `VITE_API_URL` environment variable

### Expected API Endpoints

- `GET /packages` - Get all WiFi packages
- `GET /salesmen?dealerId={id}` - Get salesmen for a dealer
- `GET /applications?dealerId={id}&agentId={id}` - Get applications
- `POST /applications` - Create new application
- `GET /commissions?dealerId={id}` - Get commission data
- `GET /installations?agentId={id}` - Get installations for an agent

## 🎨 Design Guidelines

- **Mobile-First**: All screens are responsive and optimized for smartphones
- **Bootstrap 5**: Strictly using Bootstrap 5.0+ for styling
- **FontAwesome**: Icons from FontAwesome library
- **Color Scheme**: Professional telco aesthetic (greens, whites, neutral tones)

## 👥 User Roles

### Dealer
- View dashboard with team statistics
- Manage salesmen directory
- View all sales records
- Calculate and track commissions
- View agent performance leaderboard

### Agent
- Create new customer applications
- View package comparison tool
- Track installation progress
- View personal dashboard

## 🔧 Configuration

### Multi-Tenancy

The app uses React Context for multi-tenant support. Default values:
- `dealerId`: 1 (stored in localStorage)
- `agentId`: null (set when logged in as agent)
- `userRole`: 'dealer' or 'agent'

To switch roles, update the context values in `AppContext.tsx` or use localStorage.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run api` - Start JSON-Server mock API

## 🚧 Development Notes

- All data is fetched from API (no hardcoded data in components)
- Loading states and error handling implemented
- Toast notifications for user feedback
- Form validation on multi-step application form
- Search and filter functionality on list pages

## 🔄 Next Steps

1. Connect to real backend API (replace JSON-Server)
2. Add authentication/authorization
3. Implement file upload for KYC documents
4. Add more advanced filtering and reporting
5. Implement real-time updates
6. Add export functionality for reports

## 📄 License

This project is part of the SIMplify platform.

## 👨‍💻 Development Team

- Frontend: React/TypeScript development
- Backend: API development (separate repository)

---

For questions or issues, please contact the development team.
