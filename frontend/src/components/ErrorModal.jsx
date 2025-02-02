import { useState } from "react"

const ErrorModal = ({ isOpen, onClose, errors }) => {
  const [activeTab, setActiveTab] = useState(0)

  if (!isOpen || !errors || errors.length === 0) return null

  // Group errors by file
  const groupedErrors = errors.reduce((acc, error) => {
    const key = error.file || "Unknown"
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(error)
    return acc
  }, {})

  const errorGroups = Object.entries(groupedErrors)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Validation Errors</h3>
        </div>

        <div>
          <div className="flex border-b">
            {errorGroups.map(([fileName], index) => (
              <button
                key={fileName}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 whitespace-nowrap ${
                  activeTab === index ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {fileName}
              </button>
            ))}
          </div>
          <div className="p-4 overflow-y-auto max-h-[50vh]">
            {errorGroups[activeTab] && (
              <ul className="space-y-2">
                {errorGroups[activeTab][1].map((error, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    <span className="font-medium">Row {error.row}</span>
                    {error.column && <span className="font-medium"> - Column: {error.column}</span>}
                    <span>: {error.message}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorModal

