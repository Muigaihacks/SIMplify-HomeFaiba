# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Start Mock API Server
Open a new terminal and run:
```bash
cd frontend
npm run api
```
This will start JSON-Server on `http://localhost:3000`

### Step 3: Start Development Server
In the original terminal:
```bash
cd frontend
npm run dev
```

The app will open at `http://localhost:5173`

## 🎯 Testing the Application

### As a Dealer:
1. The app defaults to dealer role
2. Navigate to different sections:
   - Dashboard: Overview statistics
   - Salesmen: View all agents
   - Sales Records: View all applications
   - Commissions: View commission breakdown
   - Leaderboard: Agent performance ranking

### As an Agent:
1. To switch to agent view, update `AppContext.tsx` or localStorage:
   ```javascript
   // In browser console:
   localStorage.setItem('userRole', 'agent');
   localStorage.setItem('agentId', '1');
   ```
2. Refresh the page
3. Navigate to:
   - Dashboard: Personal statistics
   - New Application: Create customer application
   - Packages: View package comparison
   - Installations: Track installation progress

## 📊 Mock Data

The `db.json` file contains sample data:
- 4 WiFi packages (Bronze, Silver, Gold, Platinum)
- 4 Salesmen/Agents
- 4 Sample applications
- Commission data
- Installation tracking data

## 🔧 Configuration

### Change Default Dealer/Agent
Edit `frontend/src/contexts/AppContext.tsx`:
```typescript
const [dealerId, setDealerId] = useState<number>(() => {
  const stored = localStorage.getItem('dealerId');
  return stored ? parseInt(stored, 10) : 1; // Change default here
});
```

### Connect to Real API
Update `frontend/src/services/api.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
// Change to your backend URL
```

## 🐛 Troubleshooting

### Port Already in Use
If port 3000 is taken:
```bash
npx json-server --watch db.json --port 3001
```
Then update `api.ts` to use port 3001.

### CORS Issues
If connecting to a real backend, ensure CORS is enabled on the backend.

### Bootstrap Components Not Working
Ensure Bootstrap JS is loaded in `index.html`:
```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

## 📱 Mobile Testing

The app is mobile-first. Test on:
- Chrome DevTools (Mobile view)
- Actual mobile device (if on same network)
- Responsive design breakpoints: sm, md, lg, xl

## ✅ Next Steps

1. Connect to real backend API
2. Add authentication
3. Implement file uploads
4. Add more features as needed

Happy coding! 🎉
