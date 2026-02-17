# Sales & Revenue Analytics Dashboard

A comprehensive sales and revenue analytics dashboard built with Node.js, Express, PostgreSQL, React, and Material-UI.

## 🚀 Live Demo

**Frontend**: [https://sales-revenue-analytics-dashboard-1.onrender.com]
**Backend API**: [https://sales-revenue-analytics-dashboard-kpsi.onrender.com]

## 📋 Prerequisites

## 🛠️ Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/Abinashmotract/Sales-Revenue-Analytics-Dashboard.git
cd "Sales & Revenue Analytics Dashboard"
```

### 2. Install dependencies

```bash
npm run install:all
```

### 3. PostgreSQL Database Setup

#### Local Development:

1. Create PostgreSQL database:
```sql
CREATE DATABASE sales_analytics;
```

2. Create `.env` file in `backend` directory:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sales_analytics
DB_USER=postgres
DB_PASSWORD=your_password
NODE_ENV=development
```

#### Production (Render):

Add `DATABASE_URL` in Render Environment Variables:
```env
DATABASE_URL=postgresql://sales_analytics_f5yg_user:pY3SFOAI6l3y1YaxJPsHhB2ZRsf5gVm0@dpg-d6a7j4hr0fns738f3ns0-a.oregon-postgres.render.com/sales_analytics_f5yg
NODE_ENV=production
PORT=5000
```

**Note:** Render automatically provides `DATABASE_URL` when you create a PostgreSQL database. Copy it from your PostgreSQL service's "Internal Database URL".

### 4. Run the Application

**Backend:**
```bash
npm run dev:backend
```
Backend runs on `http://localhost:5000`

**Frontend:**
```bash
npm run dev:frontend
```
Frontend runs on `http://localhost:3000`

The database tables will be automatically created when you start the backend server.

## 📁 Project Structure

```
Sales & Revenue Analytics Dashboard/
├── backend/          # Node.js + Express API
├── frontend/         # React Dashboard
└── README.md
```

## 🔧 Technologies Used

**Backend:** Node.js, Express, PostgreSQL  
**Frontend:** React, Material-UI, Redux Toolkit, Recharts

## 📝 Features

- CSV/Excel file import
- Sales & Revenue analytics
- Interactive charts (Line, Bar, Pie)
- Filter by date, category, and region
- Real-time data visualization
