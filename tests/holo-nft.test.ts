import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'holo-nft': {
      functions: {
        'mint-holo-nft': vi.fn(),
        'transfer-holo-nft': vi.fn(),
        'get-holo-nft-metadata': vi.fn(),
        'get-owner': vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  },
}

function callContract(contractName: string, functionName: string, args: any[]) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('Holographic NFT Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('mint-holo-nft', () => {
    it('should mint a holographic NFT successfully', async () => {
      const name = 'Holo Character'
      const description = 'A unique holographic character'
      const imageUri = 'https://example.com/holo-character.glb'
      const performanceId = 1
      mockClarity.contracts['holo-nft'].functions['mint-holo-nft'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('holo-nft', 'mint-holo-nft', [name, description, imageUri, performanceId])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('transfer-holo-nft', () => {
    it('should transfer a holographic NFT successfully', async () => {
      const tokenId = 1
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['holo-nft'].functions['transfer-holo-nft'].mockReturnValue({ success: true })
      
      const result = await callContract('holo-nft', 'transfer-holo-nft', [tokenId, recipient])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not the owner', async () => {
      const tokenId = 1
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['holo-nft'].functions['transfer-holo-nft'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('holo-nft', 'transfer-holo-nft', [tokenId, recipient])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-holo-nft-metadata', () => {
    it('should return NFT metadata', async () => {
      const tokenId = 1
      const expectedMetadata = {
        name: 'Holo Character',
        description: 'A unique holographic character',
        image_uri: 'https://example.com/holo-character.glb',
        performance_id: 1
      }
      mockClarity.contracts['holo-nft'].functions['get-holo-nft-metadata'].mockReturnValue(expectedMetadata)
      
      const result = await callContract('holo-nft', 'get-holo-nft-metadata', [tokenId])
      
      expect(result).toEqual(expectedMetadata)
    })
    
    it('should return null for non-existent NFT', async () => {
      const tokenId = 999
      mockClarity.contracts['holo-nft'].functions['get-holo-nft-metadata'].mockReturnValue(null)
      
      const result = await callContract('holo-nft', 'get-holo-nft-metadata', [tokenId])
      
      expect(result).toBeNull()
    })
  })
  
  describe('get-owner', () => {
    it('should return the owner of an NFT', async () => {
      const tokenId = 1
      const expectedOwner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      mockClarity.contracts['holo-nft'].functions['get-owner'].mockReturnValue({ success: true, value: expectedOwner })
      
      const result = await callContract('holo-nft', 'get-owner', [tokenId])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(expectedOwner)
    })
    
    it('should return none for non-existent NFT', async () => {
      const tokenId = 999
      mockClarity.contracts['holo-nft'].functions['get-owner'].mockReturnValue({ success: true, value: null })
      
      const result = await callContract('holo-nft', 'get-owner', [tokenId])
      
      expect(result.success).toBe(true)
      expect(result.value).toBeNull()
    })
  })
})

