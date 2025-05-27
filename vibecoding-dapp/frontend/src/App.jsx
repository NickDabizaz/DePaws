import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contractConfig'
import WalletConnect from './components/WalletConnect'
import PostSnippetForm from './components/PostSnippetForm'
import SnippetCard from './components/SnippetCard'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'

function App() {
  // Wallet and contract state
  const [provider, setProvider] = useState(null)  // eslint-disable-line no-unused-vars
  const [signer, setSigner] = useState(null)  // eslint-disable-line no-unused-vars
  const [contract, setContract] = useState(null)
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  
  // App state
  const [snippets, setSnippets] = useState([])
  const [vibeEmojis, setVibeEmojis] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentView, setCurrentView] = useState('home') // 'home' or 'post'

  // Connect to wallet
  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask to use this DApp')
        return
      }

      setLoading(true)
      setError('')

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      // Create provider and signer
      const web3Provider = new ethers.BrowserProvider(window.ethereum)
      const web3Signer = await web3Provider.getSigner()
      const network = await web3Provider.getNetwork()

      // Create contract instance
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, web3Signer)

      // Update state
      setProvider(web3Provider)
      setSigner(web3Signer)
      setContract(contractInstance)
      setAccount(accounts[0])
      setChainId(network.chainId.toString())

      // Load initial data
      await loadVibeEmojis(contractInstance)
      await loadSnippets(contractInstance)

    } catch (error) {
      console.error('Error connecting wallet:', error)
      setError('Failed to connect wallet: ' + error.message)
    } finally {
      setLoading(false)
    }
  }, [loadSnippets, loadVibeEmojis])  // Include dependencies

  // Load vibe emojis from contract
  const loadVibeEmojis = async (contractInstance = contract) => {
    try {
      if (!contractInstance) return
      const emojis = await contractInstance.getVibeEmojis()
      setVibeEmojis(emojis)
    } catch (error) {
      console.error('Error loading vibe emojis:', error)
    }
  }

  // Load all snippets from contract
  const loadSnippets = async (contractInstance = contract) => {
    try {
      if (!contractInstance) return
      
      setLoading(true)
      const snippetIds = await contractInstance.getAllSnippetIds()
      
      const snippetPromises = snippetIds.map(async (id) => {
        const snippet = await contractInstance.getSnippet(id)
        const vibeCounts = await contractInstance.getVibeCounts(id)
        
        return {
          id: snippet.id.toString(),
          poster: snippet.poster,
          title: snippet.title,
          description: snippet.description,
          codeContent: snippet.codeContent,
          timestamp: snippet.timestamp.toString(),
          vibeCounts: vibeCounts.map(count => count.toString())
        }
      })

      const loadedSnippets = await Promise.all(snippetPromises)
      setSnippets(loadedSnippets.reverse()) // Show newest first
    } catch (error) {
      console.error('Error loading snippets:', error)
      setError('Failed to load snippets: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          // User disconnected
          setAccount(null)
          setProvider(null)
          setSigner(null)
          setContract(null)
          setSnippets([])
        } else {
          // Account changed
          connectWallet()
        }
      })

      window.ethereum.on('chainChanged', () => {
        // Reload the page when chain changes
        window.location.reload()
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged')
        window.ethereum.removeAllListeners('chainChanged')
      }
    }
  }, [connectWallet])

  // Post new snippet
  const postSnippet = async (title, description, codeContent) => {
    try {
      if (!contract) throw new Error('Contract not connected')
      
      setLoading(true)
      setError('')

      const tx = await contract.postSnippet(title, description, codeContent)
      await tx.wait()

      // Reload snippets after posting
      await loadSnippets()
      setCurrentView('home') // Switch back to home view
      
      return true
    } catch (error) {
      console.error('Error posting snippet:', error)
      setError('Failed to post snippet: ' + error.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Add vibe to snippet
  const addVibe = async (snippetId, vibeId) => {
    try {
      if (!contract) throw new Error('Contract not connected')
      
      setLoading(true)
      setError('')

      const tx = await contract.addVibe(snippetId, vibeId)
      await tx.wait()

      // Reload snippets after adding vibe
      await loadSnippets()
      
      return true
    } catch (error) {
      console.error('Error adding vibe:', error)
      setError('Failed to add vibe: ' + error.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Check if user has vibed on a snippet
  const hasUserVibed = async (snippetId, vibeId) => {
    try {
      if (!contract || !account) return false
      return await contract.hasUserVibed(snippetId, vibeId, account)
    } catch (error) {
      console.error('Error checking user vibe:', error)
      return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600 cursor-pointer"
                  onClick={() => setCurrentView('home')}>
                VibeCoding
              </h1>
              <div className="ml-10 flex items-center space-x-4">
                <button
                  onClick={() => setCurrentView('home')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'home' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => setCurrentView('post')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentView === 'post' 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  disabled={!account}
                >
                  Post Snippet
                </button>
              </div>
            </div>
            
            <WalletConnect 
              account={account}
              chainId={chainId}
              onConnect={connectWallet}
              loading={loading}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onClose={() => setError('')} />
          </div>
        )}

        {currentView === 'home' && (
          <div>
            <div className="px-4 py-6 sm:px-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Code Snippets</h2>
                {loading && <LoadingSpinner />}
              </div>
              
              {snippets.length === 0 && !loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No snippets posted yet.</p>
                  {account && (
                    <button
                      onClick={() => setCurrentView('post')}
                      className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                    >
                      Post the First Snippet
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                  {snippets.map((snippet) => (
                    <SnippetCard
                      key={snippet.id}
                      snippet={snippet}
                      vibeEmojis={vibeEmojis}
                      onAddVibe={addVibe}
                      hasUserVibed={hasUserVibed}
                      currentAccount={account}
                      loading={loading}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'post' && (
          <div className="px-4 py-6 sm:px-0">
            <PostSnippetForm
              onSubmit={postSnippet}
              loading={loading}
              connected={!!account}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
