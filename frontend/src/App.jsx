import { useState } from "react";
import FileUpload from "./components/FileUpload";
import ErrorModal from "./components/ErrorModal";
import DataPreview from "./components/DataPreview";
import ProgressIndicator from "./components/ProgressIndicator";

function App() {
  const [filesData, setFilesData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importStatus, setImportStatus] = useState({ success: false, message: "" });

  const handleFilesUpload = async (files) => {
    setIsLoading(true);
    setProgress(0);
    setImportStatus({ success: false, message: "" });

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setFilesData(data);

      // Check if any file has validation errors
      const hasErrors = Object.values(data).some((fileData) => fileData.some((row) => row.isInvalid));

      if (hasErrors) {
        const allErrors = [];
        Object.entries(data).forEach(([fileName, fileData]) => {
          fileData.forEach((row, index) => {
            if (row.isInvalid) {
              allErrors.push({
                file: fileName,
                row: index + 2,
                message: "Row is invalid due to validation errors",
              });
            }
          });
        });
        setErrors(allErrors);
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setErrors([{ message: `Error uploading files: ${error.message}` }]);
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };

  const handleImport = async () => {
    if (!filesData || Object.keys(filesData).length === 0) {
      setErrors([{ message: "No data to import. Please upload files first." }]);
      setIsErrorModalOpen(true);
      return;
    }
  
    setIsLoading(true);
    setProgress(0);
  
    try {
      const response = await fetch("http://localhost:5000/api/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filesData),
      });
  
      // Check if the response is JSON
      const result = response.headers.get("content-type")?.includes("application/json")
        ? await response.json()
        : { error: "Unexpected response format" };
  
      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }
  
      if (result.errors && result.errors.length > 0) {
        setErrors(result.errors);
        setIsErrorModalOpen(true);
      }
  
      setImportStatus({
        success: true,
        message: `Successfully imported ${result.totalImported} rows. ${
          result.totalSkipped > 0 ? `${result.totalSkipped} rows were skipped due to validation errors.` : ""
        }`,
      });
  
      // Update the UI with the imported data, highlighting invalid rows
      if (result.importedData) {
        setFilesData(result.importedData);
      }
    } catch (error) {
      console.error("Error importing data:", error);
      setImportStatus({
        success: false,
        message: `Error importing data: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
      setProgress(100);
    }
  };
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Excel Data Importer</h1>

      <FileUpload onFilesUpload={handleFilesUpload} />

      {isLoading && (
        <div className="my-4">
          <ProgressIndicator progress={progress} />
        </div>
      )}

      {importStatus.message && (
        <div
          className={`my-4 p-4 rounded ${
            importStatus.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {importStatus.message}
        </div>
      )}

      {filesData && <DataPreview filesData={filesData} onImport={handleImport} setFilesData={setFilesData} />}

      <ErrorModal isOpen={isErrorModalOpen} onClose={() => setIsErrorModalOpen(false)} errors={errors} />
    </div>
  );
}

export default App;