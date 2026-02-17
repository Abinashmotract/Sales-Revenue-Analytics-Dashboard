# Sales & Revenue Analytics Dashboard

A comprehensive sales and revenue analytics dashboard built with Node.js, Express, PostgreSQL, React, and Material-UI. This application allows users to import sales data via CSV/Excel files and visualize sales trends, Product Wise Sales, and Revenue By Region.

## Features

### Backend
- RESTful API built with Node.js and Express
- PostgreSQL database for data storage
- CSV/Excel file import functionality
- API endpoints for:
  - Total sales and revenue for a given period
  - Filtered sales by product, category, and region
  - Sales trend data (daily, weekly, monthly)
  - Product Wise Sales statistics
  - Revenue By Region
- Comprehensive validation and error handling

### Frontend
- Modern React application with Material-UI
- CSV/Excel file upload and processing
- Interactive charts and visualizations:
  - **Line Chart**: Revenue trends over time
  - **Bar Chart**: Product Wise Sales
  - **Pie Chart**: Revenue By Region
- Advanced filtering:
  - Date range filter
  - Category filter
  - Region filter
- Redux Toolkit for state management
- Error handling, validation, and loading indicators

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd "Sales & Revenue Analytics Dashboard"
```

### 2. Install dependencies

Install all dependencies for both backend and frontend:

```bash
npm run install:all
```

Or install them separately:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Set up PostgreSQL database

1. Create a PostgreSQL database:

```sql
CREATE DATABASE sales_analytics;
```

2. Configure database connection:

Copy the `.env.example` file in the backend directory and create a `.env` file:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sales_analytics
DB_USER=postgres
DB_PASSWORD=your_password
NODE_ENV=development
```

### 4. Initialize the database

The database tables will be automatically created when you start the backend server for the first time.

## Running the Application

### Development Mode

#### Option 1: Run both backend and frontend together

From the root directory:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

#### Option 2: Run separately

**Backend:**
```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm start
```

The frontend application will start on `http://localhost:3000`

### Production Build

To build the frontend for production:

```bash
npm run build:frontend
```

## API Endpoints

### Base URL: `http://localhost:5000/api`

#### Sales Data Import
- **POST** `/sales/import`
  - Upload CSV/Excel file to import sales data
  - Content-Type: `multipart/form-data`
  - Body: `file` (file upload)

#### Get Total Sales and Revenue
- **GET** `/sales/total`
  - Query Parameters:
    - `startDate` (optional): Start date (YYYY-MM-DD)
    - `endDate` (optional): End date (YYYY-MM-DD)

#### Get Filtered Sales
- **GET** `/sales/filtered`
  - Query Parameters:
    - `startDate` (optional): Start date
    - `endDate` (optional): End date
    - `product` (optional): Product name filter
    - `category` (optional): Category filter
    - `region` (optional): Region filter
    - `page` (optional): Page number (default: 1)
    - `limit` (optional): Items per page (default: 100)

#### Get Sales Trend
- **GET** `/sales/trend`
  - Query Parameters:
    - `startDate` (optional): Start date
    - `endDate` (optional): End date
    - `period` (optional): `daily`, `weekly`, or `monthly` (default: `daily`)

#### Get Product Wise Sales
- **GET** `/sales/products`
  - Query Parameters:
    - `startDate` (optional): Start date
    - `endDate` (optional): End date

#### Get Revenue By Region
- **GET** `/sales/regions`
  - Query Parameters:
    - `startDate` (optional): Start date
    - `endDate` (optional): End date

#### Get Categories
- **GET** `/sales/categories`
  - Returns list of unique categories

#### Get Regions List
- **GET** `/sales/regions-list`
  - Returns list of unique regions

## CSV/Excel File Format

The application supports two data formats:

### Format 1: Sales Data Format

The imported file should have the following columns:

- `date` (required): Date in YYYY-MM-DD format
- `product_name` or `product` or `Product Name` (required): Product name
- `category` or `Category` (required): Product category
- `region` or `Region` (required): Sales region
- `quantity` (required): Number of units sold
- `unit_price` (required): Price per unit

Example CSV format:
```csv
date,product_name,category,region,quantity,unit_price
2024-01-01,Product A,Electronics,North,10,99.99
2024-01-02,Product B,Clothing,South,5,49.99
```

### Format 2: Product Review Data Format

The application can also import product review data with the following columns:

- `product_id` (required): Product name/ID
- `category` (required): Product category (supports hierarchical format with `|` separator)
- `discounted_price` or `actual_price` (required): Product price (supports ₹, $, or numeric format)
- `rating_count` (optional): Number of ratings (used to estimate quantity sold)
- `user_name` (optional): User names (comma-separated)
- `review_title` (optional): Review titles
- `review_content` (optional): Review content

Example Excel format:
```
product_id: Wayona Nylon Braided USB Cable
category: Computers&Accessories|Accessories&Peripherals|Cables
discounted_price: ₹399.00
actual_price: ₹1,099.00
rating_count: 24,269
```

**Note:** When importing product review data, the system automatically:
- Extracts the main category from hierarchical categories
- Uses `rating_count` to estimate quantity sold (10% of ratings)
- Uses `discounted_price` or `actual_price` as unit price
- Generates dates distributed over the last 30 days
- Sets region as "Online" for e-commerce data

## Project Structure

```
Sales & Revenue Analytics Dashboard/
├── backend/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection
│   │   └── initDB.js            # Database initialization
│   ├── controllers/
│   │   └── salesController.js   # Sales API controllers
│   ├── middleware/
│   │   ├── errorHandler.js      # Error handling middleware
│   │   └── upload.js            # File upload middleware
│   ├── routes/
│   │   └── salesRoutes.js       # Sales API routes
│   ├── utils/
│   │   └── fileParser.js        # CSV/Excel parser utilities
│   ├── uploads/                 # Uploaded files directory
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Express server
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js              # Main dashboard component
│   │   │   ├── FileUpload.js             # File upload component
│   │   │   ├── Filters.js                # Filter component
│   │   │   ├── TotalSalesCard.js         # Total sales card
│   │   │   ├── RevenueTrendChart.js      # Line chart component
│   │   │   ├── ProductWiseSalesChart.js  # Bar chart component
│   │   │   └── RevenueByRegionChart.js   # Pie chart component
│   │   ├── store/
│   │   │   ├── store.js                  # Redux store
│   │   │   └── slices/
│   │   │       └── salesSlice.js          # Sales Redux slice
│   │   ├── services/
│   │   │   └── salesAPI.js               # API service functions
│   │   ├── App.js                         # Main App component
│   │   ├── index.js                       # React entry point
│   │   └── index.css                      # Global styles
│   ├── package.json
│   └── .gitignore
├── package.json
└── README.md
```

## Technologies Used

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **PostgreSQL**: Relational database
- **Multer**: File upload handling
- **XLSX**: Excel file parsing
- **csv-parser**: CSV file parsing
- **express-validator**: Input validation

### Frontend
- **React**: UI library
- **Material-UI (MUI)**: Component library
- **Redux Toolkit**: State management
- **Recharts**: Chart library
- **Axios**: HTTP client

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify database credentials in `.env` file
- Check if the database exists

### File Upload Issues
- Ensure file size is less than 10MB
- Check file format (CSV, XLS, or XLSX)
- Verify required columns are present in the file

### CORS Issues
- Ensure backend CORS is properly configured
- Check if backend server is running on the correct port

## License

ISC

## Author

Sales & Revenue Analytics Dashboard
# Sales-Revenue-Analytics-Dashboard
