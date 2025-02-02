const mongoose = require("mongoose");
const { sheetConfigs } = require("../config/sheetConfig");

const createDynamicModel = (fileName, config) => {
  const modelName = `${fileName.replace(/\.[^/.]+$/, "")}`;
  if (mongoose.models[modelName]) {
    return mongoose.models[modelName];
  }

  const schema = new mongoose.Schema(
    Object.entries(config).reduce((acc, [field, rules]) => {
      acc[field] = {
        type:
          rules.type === "number" ? Number : rules.type === "boolean" ? Boolean : rules.type === "date" ? Date : String,
        required: rules.required,
      };
      return acc;
    }, {}),
    { timestamps: true }
  );

  schema.add({
    verified: {
      type: String,
      required: false,
    },
  });

  return mongoose.model(modelName, schema);
};

const importData = async (filesData) => {
  const importedData = {};
  const errors = [];
  let totalImported = 0;
  let totalSkipped = 0;

  for (const [fileName, fileData] of Object.entries(filesData)) {
    console.log(`Importing data for file: ${fileName}`);
    console.log(`Number of rows: ${fileData.length}`);

    const config = sheetConfigs.default;
    const Model = createDynamicModel(fileName, config);

    try {
      const validData = fileData
        .filter((row) => !row.isInvalid)
        .map((row) => {
          // Convert verified field to boolean (handle case-insensitive comparison)
          const verifiedValue = typeof row.Verified === 'string' && row.Verified.toLowerCase() === "yes";
          console.log(`Row verified value: ${row.Verified}, converted value: ${verifiedValue}`);
          return { ...row, Verified: verifiedValue };
        });

      const result = await Model.insertMany(validData, { ordered: false });
      console.log(`Successfully imported ${result.length} documents for ${fileName}`);
      importedData[fileName] = result;
      totalImported += result.length;
      totalSkipped += fileData.length - result.length;
    } catch (error) {
      console.error(`Error importing data for ${fileName}:`, error);
      errors.push({ file: fileName, message: "Error importing data" });
      totalSkipped += fileData.length;
    }
  }

  return { importedData, errors, totalImported, totalSkipped };
};

module.exports = { importData, createDynamicModel };