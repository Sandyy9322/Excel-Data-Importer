import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

const FileUpload = ({ onFilesUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const validFiles = acceptedFiles.filter((file) => file.size <= 2 * 1024 * 1024)
      const invalidFiles = acceptedFiles.filter((file) => file.size > 2 * 1024 * 1024)

      if (invalidFiles.length > 0) {
        alert(`The following files exceed 2MB: ${invalidFiles.map((f) => f.name).join(", ")}`)
      }

      if (validFiles.length > 0) {
        onFilesUpload(validFiles)
      }
    },
    [onFilesUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    maxSize: 2 * 1024 * 1024,
    multiple: true,
  })

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
        transition-colors duration-200 ease-in-out
        ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}
      `}
    >
      <input {...getInputProps()} />
      <div className="space-y-2">
        <div className="text-lg">
          {isDragActive ? (
            <p className="text-blue-500">Drop the Excel files here...</p>
          ) : (
            <p>Drag and drop Excel files here, or click to select files</p>
          )}
        </div>
        <p className="text-sm text-gray-500">Only .xlsx files up to 2 MB each are accepted</p>
      </div>
    </div>
  )
}

export default FileUpload

