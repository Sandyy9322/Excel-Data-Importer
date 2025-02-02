const ProgressIndicator = ({ progress }) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        <p className="text-center mt-2">{progress}% Complete</p>
      </div>
    )
  }
  
  export default ProgressIndicator
  
  