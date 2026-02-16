# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm run install:all
```

## Step 2: Database Setup

1. Make sure PostgreSQL is installed and running
2. Create a database:
```sql
CREATE DATABASE sales_analytics;
```

3. Create `.env` file in the `backend` directory:
```bash
cd backend
touch .env
```

4. Add the following to `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sales_analytics
DB_USER=postgres
DB_PASSWORD=your_password_here
NODE_ENV=development
```

Replace `your_password_here` with your PostgreSQL password.

## Step 3: Start the Application

### Terminal 1 - Backend:
```bash
npm run dev:backend
```

### Terminal 2 - Frontend:
```bash
npm run dev:frontend
```

## Step 4: Import Sample Data

1. Open the application at `http://localhost:3000`
2. Use the "Import Sales Data" section to upload the `sample_data.csv` file
3. The dashboard will automatically update with the imported data

## Troubleshooting

- **Database connection error**: Check your PostgreSQL credentials in `backend/.env`
- **Port already in use**: Change the PORT in `backend/.env` or kill the process using the port
- **Module not found**: Run `npm install` in both backend and frontend directories
