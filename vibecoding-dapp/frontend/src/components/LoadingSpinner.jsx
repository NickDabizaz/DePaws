const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className="flex items-center justify-center space-x-3">
      <div className={`animate-spin rounded-full border-b-2 border-indigo-600 ${sizeClasses[size]}`}></div>
      {text && (
        <span className={`text-gray-600 ${textSizeClasses[size]}`}>
          {text}
        </span>
      )}
    </div>
  )
}

export default LoadingSpinner
