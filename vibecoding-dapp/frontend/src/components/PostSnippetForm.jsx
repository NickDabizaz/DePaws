import { useState } from 'react'

const PostSnippetForm = ({ onSubmit, loading, connected }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [codeContent, setCodeContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!connected) {
      alert('Please connect your wallet first')
      return
    }

    if (!title.trim() || !description.trim() || !codeContent.trim()) {
      alert('Please fill in all fields')
      return
    }

    setSubmitting(true)
    const success = await onSubmit(title.trim(), description.trim(), codeContent.trim())
    
    if (success) {
      setTitle('')
      setDescription('')
      setCodeContent('')
    }
    
    setSubmitting(false)
  }

  if (!connected) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Post a Code Snippet</h2>
            <p className="text-gray-500 mb-6">
              Connect your wallet to share your code with the community
            </p>
            <div className="inline-block bg-gray-100 text-gray-400 px-6 py-3 rounded-md">
              Connect Wallet to Continue
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Post a Code Snippet</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your code snippet a catchy title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={submitting || loading}
              maxLength={100}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {title.length}/100
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what your code does, any interesting features, or context..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              disabled={submitting || loading}
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-400 mt-1">
              {description.length}/500
            </div>
          </div>

          {/* Code Content */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Code
            </label>
            <textarea
              id="code"
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              placeholder={`// Your amazing code goes here
function example() {
  console.log("Hello VibeCoding!");
}`}
              rows={12}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
              disabled={submitting || loading}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setTitle('')
                setDescription('')
                setCodeContent('')
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={submitting || loading}
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={submitting || loading || !title.trim() || !description.trim() || !codeContent.trim()}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Posting...</span>
                </>
              ) : (
                <span>Post Snippet</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostSnippetForm
