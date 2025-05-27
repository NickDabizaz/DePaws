import { useState } from 'react'

const WalletConnect = ({ account, chainId, onConnect, loading }) => {
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    await onConnect()
    setIsConnecting(false)
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getNetworkName = (chainId) => {
    switch (chainId) {
      case '11155111':
        return 'Sepolia'
      case '1':
        return 'Mainnet'
      case '137':
        return 'Polygon'
      default:
        return 'Unknown'
    }
  }

  const isCorrectNetwork = chainId === '11155111' // Sepolia testnet

  if (!account) {
    return (
      <button
        onClick={handleConnect}
        disabled={isConnecting || loading}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center space-x-2"
      >
        {isConnecting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Connecting...</span>
          </>
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      {!isCorrectNetwork && (
        <div className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm">
          Switch to Sepolia
        </div>
      )}
      
      <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-md">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span className="text-sm text-gray-700">
          {formatAddress(account)}
        </span>
        {chainId && (
          <span className="text-xs text-gray-500">
            ({getNetworkName(chainId)})
          </span>
        )}
      </div>
    </div>
  )
}

export default WalletConnect
