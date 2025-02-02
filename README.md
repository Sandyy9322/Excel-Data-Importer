# Excel Data Importer

## Overview

The **Excel Data Importer** project is a comprehensive solution for importing, validating, and previewing Excel files (`.xlsx`) in a web application. It uses a combination of **React.js** for the frontend, **Node.js** with **Express.js** for the backend, and **MongoDB Atlas** for data storage. The project ensures robust error handling, efficient data processing, and an intuitive user interface.

## Features

### Frontend

1. **File Import Page**:
   - Drag-and-drop file upload option with a fallback file input button.
   - Accepts only `.xlsx` files with a maximum file size of 2 MB.

2. **Error Display**:
   - Displays validation errors returned from the backend in a modal dialog.
   - Shows row number and error description for each invalid row.
   - For files with multiple sheets, displays validation errors in separate tabs for each sheet.

3. **Data Preview**:
   - Dropdown to list the names of all sheets in the uploaded file.
   - Paginated table to display data of the selected sheet.
   - Formats dates in `DD-MM-YYYY` format.
   - Formats numeric values using the Indian number format (e.g., `12,34,456.00`).
   - Allows users to delete rows with confirmation.

4. **Data Import**:
   - Import button to import all valid rows to the database.
   - Skips rows with errors and highlights them.
   - Displays a success message upon successful import.

### Backend

1. **File Validation**:
   - Processes uploaded `.xlsx` files using the `xlsx` library.
   - Validates files based on predefined rules:
     - Mandatory columns: `Name`, `Amount`, `Date`, `Verified (Yes or No)`.
     - Date must be valid and fall within the current month.
     - Amount must be numeric and greater than zero.
   - Returns detailed error response if validation fails.

2. **Support for Future Extensions**:
   - Supports new sheets with different column names and validation rules without duplicating code.
   - Uses a configuration file to map Excel sheet column names to database field names and validation rules.

3. **Database Interaction**:
   - Uses **MongoDB Atlas** for data storage.
   - Efficiently handles thousands of rows.

## Tech Stack

- **Frontend**:
  - React.js with Tailwind CSS for styling.
  - Pagination for handling large datasets.
  - TypeScript (optional).

- **Backend**:
  - Node.js with Express.js for API development.
  - Mongoose for database interactions with MongoDB.

- **Database**:
  - MongoDB Atlas (free version).
