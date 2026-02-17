# Deployment Guide

## Render Deployment

### Backend Deployment

1. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Select the backend directory as root directory
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && node server.js`

2. **Environment Variables**
   Add these in Render Dashboard → Environment:
   ```
   PORT=5000
   NODE_ENV=production
   DATABASE_URL=<your-postgresql-connection-string>
   ```
   
   **Important:** Render automatically provides `DATABASE_URL` when you create a PostgreSQL database. Just copy it from your PostgreSQL service's "Internal Database URL" or "External Database URL".

3. **PostgreSQL Database Setup**
   - Create a PostgreSQL database on Render
   - Copy the connection string (format: `postgresql://user:password@host:port/database`)
   - The database name will be automatically extracted from the connection string
   - Tables will be created automatically on first run

### Frontend Deployment

1. **Create a new Static Site on Render**
   - Connect your GitHub repository
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`

2. **Environment Variables**
   Add this in Render Dashboard → Environment:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

### Example Connection String Format

```
postgresql://sales_analytics_f5yg_user:pY3SFOAI6l3y1YaxJPsHhB2ZRsf5gVm0@dpg-d6a7j4hr0fns738f3ns0-a.oregon-postgres.render.com/sales_analytics_f5yg
```

The code will automatically parse:
- **User**: `sales_analytics_f5yg_user`
- **Password**: `pY3SFOAI6l3y1YaxJPsHhB2ZRsf5gVm0`
- **Host**: `dpg-d6a7j4hr0fns738f3ns0-a.oregon-postgres.render.com`
- **Port**: `5432` (default)
- **Database**: `sales_analytics_f5yg`

### Troubleshooting

**Error: "database does not exist"**
- Make sure `DATABASE_URL` is set correctly in Render environment variables
- The database name is extracted from the connection string automatically
- Check that your PostgreSQL service is running on Render

**Error: Connection timeout**
- Use "Internal Database URL" for backend services on the same Render account
- For external connections, use "External Database URL" and ensure SSL is enabled

**CORS Errors**
- Make sure backend CORS is configured to allow your frontend domain
- Check that backend URL in frontend environment variables is correct
