const multer = require('multer');
const validateFile = require('../utils/validateFile');
const DataModel = require('../models/DataModel');

const upload = multer({ storage: multer.memoryStorage() });

exports.uploadFile = upload.single('file'), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const errors = validateFile(fileBuffer);

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const validData = []; 
    await DataModel.insertMany(validData);

    res.json({ message: 'File uploaded and data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};