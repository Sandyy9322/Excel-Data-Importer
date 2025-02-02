import { useState, useEffect } from "react";
import ProgressIndicator from "./ProgressIndicator";

const DataPreview = ({ filesData, onImport, setFilesData, importStatus = { success: false }, progress }) => {
  const [selectedFile, setSelectedFile] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (filesData && Object.keys(filesData).length > 0) {
      setSelectedFile(Object.keys(filesData)[0]);
    }
  }, [filesData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFile]);

  if (!filesData || Object.keys(filesData).length === 0) {
    return <div className="text-center text-gray-600">No data available for preview.</div>;
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.value);
  };

  const handleDeleteRow = (index) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      const updatedData = [...filesData[selectedFile]];
      updatedData.splice(index, 1);
      setFilesData({ ...filesData, [selectedFile]: updatedData });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "INR",
    }).format(num);
  };

  const currentFileData = filesData[selectedFile] || [];
  const pageCount = Math.ceil(currentFileData.length / rowsPerPage);
  const currentData = currentFileData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const getDisplayFields = (data) => {
    if (data.length === 0) return [];
    const fields = Object.keys(data[0]).filter(
      (key) => !["_id", "createdAt", "updatedAt", "__v", "isInvalid", "errors"].includes(key)
    );
    // Ensure 'Date' comes before 'Verified'
    const reorderedFields = [];
    fields.forEach((key) => {
      if (key.toLowerCase().includes("date")) {
        reorderedFields.push(key, "verified");
      } else if (key !== "verified") {
        reorderedFields.push(key);
      }
    });
    return [...new Set(reorderedFields)];
  };

  return (
    <div className="mt-8">
      <ProgressIndicator progress={progress} />
      <div className="flex justify-between items-center mb-4">
        <select value={selectedFile} onChange={handleFileChange} className="border p-2 rounded">
          {Object.keys(filesData).map((file) => (
            <option key={file} value={file}>
              {file}
            </option>
          ))}
        </select>
        {!importStatus.success && (
          <button
            onClick={onImport}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Import Data
          </button>
        )}
      </div>
      {currentData.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border p-2 bg-gray-50">#</th>
                  {getDisplayFields(currentData).map((key, idx) => (
                    <th key={idx} className="border p-2 bg-gray-50">
                      {key === "verified" ? "Verified" : key}
                    </th>
                  ))}
                  <th className="border p-2 bg-gray-50">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, index) => (
                  <tr key={index} className={row.isInvalid ? "bg-red-50 hover:bg-red-100" : "bg-green-50 hover:bg-green-100"}>
                    <td className="border p-2">{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                    {getDisplayFields(currentData).map((key, idx) => (
                      <td key={idx} className="border p-2">
                        {key === "verified"
                          ? row.verified ? "Yes" : "No"
                          : key.toLowerCase().includes("date")
                          ? formatDate(row[key])
                          : key.toLowerCase() === "amount"
                          ? formatNumber(row[key])
                          : row[key]}
                      </td>
                    ))}
                    <td className="border p-2">
                      <button
                        onClick={() => handleDeleteRow(index + (currentPage - 1) * rowsPerPage)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {pageCount}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
              disabled={currentPage === pageCount}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-600">No data available for preview.</div>
      )}
    </div>
  );
};

export default DataPreview;
