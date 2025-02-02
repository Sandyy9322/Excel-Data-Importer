const express = require('express');
const multer = require('multer');
const path = require('path');
const XLSX = require('xlsx');
const { sheetConfigs } = require('../config/sheetConfig'); // Assuming you have a config for validation
const { importData } = require('../utils/dbUtils'); // Ensure the correct path to dbUtils.js

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Multer upload configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file limit
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== '.xlsx') {
      return cb(new Error('Only .xlsx files are allowed'));
    }
    cb(null, true);
  },
});

// Helper function to validate Excel files
function validateExcelFiles(files) {
  const results = {};

  for (const file of files) {
    const workbook = XLSX.readFile(file.path);
    const fileName = file.originalname;
    results[fileName] = [];

    const sheetName = workbook.SheetNames[0]; // Only process the first sheet
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: false, dateNF: 'yyyy-mm-dd' });

    const config = sheetConfigs.default; // Use the default config for all sheets

    jsonData.forEach((row, index) => {
      const validatedRow = validateRow(row, config, index + 2);
      results[fileName].push(validatedRow);
    });
  }

  return results;
}

// Helper function to validate individual rows
function validateRow(row, config, rowIndex) {
  const errors = [];
  const validatedRow = {};

  for (const [field, rules] of Object.entries(config)) {
    const value = row[field];

    if (rules.required && (value === undefined || value === null || value.toString().trim() === '')) {
      errors.push(`${field} is required`);
    } else if (value !== undefined && value !== null) {
      switch (rules.type) {
        case 'string':
          validatedRow[field] = value;
          break;
        case 'number':
          if (isNaN(Number(value)) || (rules.min !== undefined && Number(value) <= rules.min)) {
            errors.push(`${field} must be a number greater than ${rules.min}`);
          } else {
            validatedRow[field] = Number(value);
          }
          break;
        case 'date':
          const date = new Date(value);
          if (isNaN(date.getTime())) {
            errors.push(`${field} must be a valid date`);
          } else {
            const currentMonth = new Date().getMonth();
            if (date.getMonth() !== currentMonth) {
              errors.push(`${field} must be within the current month`);
            } else {
              validatedRow[field] = date;
            }
          }
          break;
        case 'boolean':
          if (typeof value !== 'boolean' && !['yes', 'no'].includes(value.toLowerCase())) {
            errors.push(`${field} must be 'Yes' or 'No'`);
          } else {
            validatedRow[field] = value.toLowerCase() === 'yes';
          }
          break;
      }
    }
  }

  return {
    ...validatedRow,
    isInvalid: errors.length > 0,
    errors: errors.length > 0 ? errors : undefined,
    rowIndex,
  };
}

// POST route to upload files and validate them
router.post('/upload', upload.array('files', 5), (req, res) => {
  try {
    const files = req.files;
    const validationResults = validateExcelFiles(files);
    res.json(validationResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/import", async (req, res) => {
  const filesData = req.body;
  console.log("Received data for import:", filesData);

  if (!filesData || Object.keys(filesData).length === 0) {
    return res.status(400).json({ error: "No data to import." });
  }

  try {
    const result = await importData(filesData);
    console.log("Import result:", result);
    res.json(result);
  } catch (error) {
    console.error("Error importing data:", error);
    res.status(500).json({ error: "Error importing data" });
  }
});

module.exports = router;