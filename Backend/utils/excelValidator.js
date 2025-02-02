const XLSX = require("xlsx")
const path = require("path")
const { sheetConfigs } = require("../config/sheetConfig")

function validateExcelFiles(files) {
  const results = {}

  for (const file of files) {
    const workbook = XLSX.readFile(file.path)
    const fileName = file.originalname
    results[fileName] = []

    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const jsonData = XLSX.utils.sheet_to_json(sheet, { raw: false, dateNF: "yyyy-mm-dd" })

    const config = sheetConfigs.default

    jsonData.forEach((row, index) => {
      const validatedRow = validateRow(row, config, index + 2)
      results[fileName].push(validatedRow)
    })
  }

  return results
}

function validateRow(row, config, rowIndex) {
  const errors = []
  const validatedRow = {}

  for (const [field, rules] of Object.entries(config)) {
    const value = row[field]

    if (rules.required && (value === undefined || value === null || value.toString().trim() === "")) {
      errors.push(`${field} is required`)
    } else if (value !== undefined && value !== null) {
      switch (rules.type) {
        case "string":
          validatedRow[field] = value
          break
        case "number":
          if (isNaN(Number(value)) || (rules.min !== undefined && Number(value) <= rules.min)) {
            errors.push(`${field} must be a number greater than ${rules.min}`)
          } else {
            validatedRow[field] = Number(value)
          }
          break
        case "date":
          const date = new Date(value)
          if (isNaN(date.getTime())) {
            errors.push(`${field} must be a valid date`)
          } else {
            const currentMonth = new Date().getMonth()
            if (date.getMonth() !== currentMonth) {
              errors.push(`${field} must be within the current month`)
            } else {
              validatedRow[field] = date
            }
          }
          break
        case "boolean":
          if (typeof value !== "boolean" && !["yes", "no"].includes(value.toLowerCase())) {
            errors.push(`${field} must be 'Yes' or 'No'`)
          } else {
            validatedRow[field] = value.toLowerCase() === "yes"
          }
          break
      }
    }
  }

  validatedRow.Verified = row.Verified && row.Verified.toLowerCase() === "yes"

  return {
    ...validatedRow,
    isInvalid: errors.length > 0,
    errors: errors.length > 0 ? errors : undefined,
    rowIndex,
  }
}

module.exports = { validateExcelFiles }

