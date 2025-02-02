# Excel Data Importer

## Overview

The **Excel Data Importer** project is a comprehensive solution for importing, validating, and previewing Excel files (`.xlsx`) in a web application. It uses **React.js** for the frontend, **Node.js** with **Express.js** for the backend, and **MongoDB Atlas** for data storage. The project ensures robust error handling, efficient data processing, and an intuitive user interface.

## Features

### Frontend

1. **File Import Page**:
   - Drag-and-drop file upload with a fallback file input button.
   - Accepts only `.xlsx` files with a maximum file size of 2 MB.

2. **Error Display**:
   - Displays validation errors returned from the backend in a modal dialog.
   - Shows row number and error description for each invalid row.
   - Displays validation errors in separate tabs for each sheet in multi-sheet files.

3. **Data Preview**:
   - Dropdown to list sheet names in the uploaded file.
   - Paginated table to display selected sheet data.
   - Formats dates in `DD-MM-YYYY` format.
   - Formats numeric values using the Indian number format (e.g., `12,34,456.00`).
   - Allows users to delete rows with confirmation.

4. **Data Import**:
   - Import button to add valid rows to the database.
   - Skips invalid rows and highlights them.
   - Displays a success message upon successful import.

### Backend

1. **File Validation**:
   - Processes uploaded `.xlsx` files using the `xlsx` library.
   - Validates based on predefined rules:
     - Mandatory columns: `Name`, `Amount`, `Date`, `Verified (Yes or No)`.
     - Date must be valid and within the current month.
     - Amount must be numeric and greater than zero.
   - Returns detailed error responses if validation fails.

2. **Support for Future Extensions**:
   - Supports new sheets with different column names and validation rules dynamically.
   - Uses a configuration file to map Excel sheet columns to database fields.

3. **Database Interaction**:
   - Uses **MongoDB Atlas** for data storage.
   - Efficiently handles thousands of rows.

## Tech Stack

- **Frontend**:
  - React.js with Tailwind CSS.
  - Pagination for large datasets.
  - TypeScript (optional).

- **Backend**:
  - Node.js with Express.js.
  - Mongoose for MongoDB interactions.

- **Database**:
  - MongoDB Atlas (free tier).

## Setup Instructions

### Prerequisites

- Node.js (v12 or higher)
- MongoDB Atlas account
- Git

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Sandyy9322/Excel-Data-Importer.git
   cd excel-data-importer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and add your MongoDB URI:
   ```env
   MONGODB_URI=<your-mongodb-uri>
   ```

4. Start the backend server:
   ```bash
   node server.js
   ```

## Usage

1. Open the frontend application in your browser.
2. Upload an Excel file via drag-and-drop or file input.
3. Preview data and validation errors (if any).
4. Import valid rows to the database using the "Import Data" button.
5. View success messages and skipped rows due to validation errors.


## Contact

For any questions or issues, please contact Sandyy9322.

