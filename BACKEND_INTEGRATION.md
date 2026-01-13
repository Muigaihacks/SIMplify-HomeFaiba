# Backend Integration Guide

## ✅ Current Setup: JSON Data Support

**Yes, the frontend is already reading data from JSON files!**

The application currently uses **JSON-Server** as a mock API that reads from `db.json`. This means:

1. ✅ **All data comes from JSON** - The `db.json` file contains all the sample data
2. ✅ **RESTful API structure** - JSON-Server provides REST endpoints automatically
3. ✅ **Easy to test** - You can modify `db.json` and see changes immediately

### How It Works Now:

```
db.json (JSON file)
    ↓
JSON-Server (Mock API on port 3000)
    ↓
apiService.ts (API service layer)
    ↓
React Components (Your screens)
```

## 🔄 Connecting to Real Backend

**Yes, it will be very easy to connect to your friend's backend!**

The frontend is designed with a **clean API abstraction layer** that makes switching from mock API to real backend seamless.

### Step 1: Update API Base URL

In `frontend/src/services/api.ts`, the API URL is already configurable:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

**Option A: Environment Variable (Recommended)**
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=https://your-backend-api.com/api/v1
```

**Option B: Direct Update**
Simply change the default URL in `api.ts`:
```typescript
const API_BASE_URL = 'https://your-backend-api.com/api/v1';
```

### Step 2: Verify API Endpoints Match

The frontend expects these endpoints:

| Frontend Call | Expected Backend Endpoint | Method |
|--------------|--------------------------|--------|
| `getPackages()` | `GET /packages` | GET |
| `getSalesmen(dealerId)` | `GET /salesmen?dealerId={id}` | GET |
| `getApplications(dealerId, agentId?)` | `GET /applications?dealerId={id}&agentId={id}` | GET |
| `createApplication(data)` | `POST /applications` | POST |
| `updateApplication(id, data)` | `PATCH /applications/{id}` | PATCH |
| `getCommissions(dealerId, agentId?)` | `GET /commissions?dealerId={id}` | GET |
| `getInstallations(agentId)` | `GET /installations?agentId={id}` | GET |

### Step 3: Verify Response Format

The frontend expects JSON responses in this format:

**Packages:**
```json
[
  {
    "id": 1,
    "name": "Bronze",
    "speed": "10 Mbps",
    "price": 2500,
    "description": "...",
    "features": ["..."],
    "color": "#cd7f32"
  }
]
```

**Applications:**
```json
[
  {
    "id": 1,
    "applicationNumber": "APP-2024-001",
    "dealerId": 1,
    "agentId": 1,
    "agentName": "John Kamau",
    "customerName": "David Mwangi",
    "status": "pending",
    ...
  }
]
```

### Step 4: Handle Authentication (If Needed)

If your backend requires authentication, update `apiService.ts`:

```typescript
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Then use in fetch calls:
const response = await fetch(url, {
  headers: getAuthHeaders()
});
```

## 🎯 What Makes Integration Easy

1. **Single API Service File** - All API calls are in one place (`services/api.ts`)
2. **TypeScript Types** - Type definitions ensure data structure matches
3. **Error Handling** - Already implemented, just works with real backend
4. **No Component Changes** - Components don't need to change, only the API service

## 📝 Quick Integration Checklist

- [ ] Get backend API base URL from your friend
- [ ] Update `VITE_API_URL` in `.env` or `api.ts`
- [ ] Verify endpoint URLs match (check the table above)
- [ ] Test one endpoint (e.g., `GET /packages`)
- [ ] Verify response format matches expected structure
- [ ] Add authentication if needed
- [ ] Test all endpoints
- [ ] Deploy!

## 🚀 Testing Integration

1. **Start your friend's backend** (on whatever port it uses)
2. **Update API URL** in frontend
3. **Run frontend**: `npm run dev`
4. **Test each screen** to ensure data loads correctly

## 💡 Pro Tips

- Keep `db.json` and JSON-Server for local development/testing
- Use environment variables for different environments (dev, staging, prod)
- The API service layer handles all the complexity, so components stay clean
- If backend structure differs slightly, you can add transformation functions in `apiService.ts`

---

**Bottom Line:** The frontend is already reading from JSON and is designed to easily switch to your friend's backend. Just update the API URL and verify the endpoints match! 🎉
