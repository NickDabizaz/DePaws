import { useState, useEffect } from 'react'

const SnippetCard = ({ 
  snippet, 
  vibeEmojis, 
  onAddVibe, 
  hasUserVibed, 
  currentAccount, 
  loading 
}) => {
  const [userVibes, setUserVibes] = useState({})
  const [addingVibe, setAddingVibe] = useState(null)

  // Check which vibes the user has already given
  useEffect(() => {
    const checkUserVibes = async () => {
      if (!currentAccount || !hasUserVibed) return
      
      const vibeChecks = {}
      for (let i = 0; i < vibeEmojis.length; i++) {
        vibeChecks[i] = await hasUserVibed(snippet.id, i)
      }
      setUserVibes(vibeChecks)
    }

    checkUserVibes()
  }, [snippet.id, currentAccount, hasUserVibed, vibeEmojis])

  const handleVibeClick = async (vibeIndex) => {
    if (!currentAccount || addingVibe !== null || loading) return
    
    // Check if user already vibed with this emoji
    if (userVibes[vibeIndex]) {
      alert('You have already vibed with this emoji!')
      return
    }

    setAddingVibe(vibeIndex)
    const success = await onAddVibe(snippet.id, vibeIndex)
    
    if (success) {
      // Update local state to reflect the new vibe
      setUserVibes(prev => ({
        ...prev,
        [vibeIndex]: true
      }))
    }
    
    setAddingVibe(null)
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(parseInt(timestamp) * 1000)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Code copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{snippet.title}</h3>
          <span className="text-sm text-gray-500">#{snippet.id}</span>
        </div>
        
        <p className="text-gray-600 mb-3">{snippet.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <span>By {formatAddress(snippet.poster)}</span>
          <span>•</span>
          <span>{formatTimestamp(snippet.timestamp)}</span>
        </div>
      </div>

      {/* Code Content */}
      <div className="p-6">
        <div className="relative">
          <pre className="bg-gray-50 rounded-md p-4 overflow-x-auto text-sm">
            <code className="font-mono text-gray-800">{snippet.codeContent}</code>
          </pre>
          
          <button
            onClick={() => copyToClipboard(snippet.codeContent)}
            className="absolute top-2 right-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-md p-2 text-xs text-gray-600 transition-colors duration-200"
            title="Copy code"
          >
            📋 Copy
          </button>
        </div>
      </div>

      {/* Vibes Section */}
      <div className="px-6 pb-6">
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">React with a vibe:</h4>
          
          <div className="flex flex-wrap gap-2">
            {vibeEmojis.map((emoji, index) => {
              const count = snippet.vibeCounts[index] || '0'
              const hasVibed = userVibes[index]
              const isAdding = addingVibe === index
              
              return (
                <button
                  key={index}
                  onClick={() => handleVibeClick(index)}
                  disabled={!currentAccount || isAdding || loading || hasVibed}
                  className={`
                    inline-flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${hasVibed 
                      ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                    }
                    ${!currentAccount || isAdding || loading 
                      ? 'cursor-not-allowed opacity-50' 
                      : 'cursor-pointer hover:scale-105'
                    }
                  `}
                  title={hasVibed ? 'You vibed with this!' : 'Click to vibe'}
                >
                  <span className="text-lg">{emoji}</span>
                  <span>{count}</span>
                  {isAdding && (
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-600"></div>
                  )}
                </button>
              )
            })}
          </div>
          
          {!currentAccount && (
            <p className="text-xs text-gray-500 mt-2">
              Connect your wallet to react with vibes
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default SnippetCard
