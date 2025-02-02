const sheetConfigs = {
  Sheet1: {
    sheetName: "Sheet1",
    Name: { type: "string", required: true },
    Amount: { type: "number", required: true, min: 0 },
    Date: { type: "date", required: true },
    Verified: { type: "string", required: false },
  },
  Sheet2: {
    sheetName: "Sheet2",
    Name: { type: "string", required: true },
    Amount: { type: "number", required: true, min: 0 },
    Date: { type: "date", required: true, allowPreviousMonth: true },
    InvoiceDate: { type: "date", required: true },
    ReceiptDate: { type: "date", required: false },
    Verified: { type: "string", required: false },
  },
  default: {
    sheetName: "default",
    Name: { type: "string", required: true },
    Amount: { type: "number", required: true, min: 0 },
    Date: { type: "date", required: false },
  },
}

module.exports = { sheetConfigs }

