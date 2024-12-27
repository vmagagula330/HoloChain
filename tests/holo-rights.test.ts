import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'holo-rights': {
      functions: {
        'register-performance': vi.fn(),
        'update-royalties': vi.fn(),
        'get-performance': vi.fn(),
        'get-royalty': vi.fn(),
        'pay-royalties': vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    'block-height': 123456,
  },
}

function callContract(contractName: string, functionName: string, args: any[]) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('Holographic Rights Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('register-performance', () => {
    it('should register a performance successfully', async () => {
      const title = 'Holographic Concert'
      const description = 'A mesmerizing holographic music performance'
      const royaltyPercentage = 10
      mockClarity.contracts['holo-rights'].functions['register-performance'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('holo-rights', 'register-performance', [title, description, royaltyPercentage])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
    
    it('should fail if royalty percentage is over 100', async () => {
      const title = 'Invalid Performance'
      const description = 'This should fail'
      const royaltyPercentage = 101
      mockClarity.contracts['holo-rights'].functions['register-performance'].mockReturnValue({ success: false, error: 400 })
      
      const result = await callContract('holo-rights', 'register-performance', [title, description, royaltyPercentage])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(400)
    })
  })
  
  describe('update-royalties', () => {
    it('should update royalties successfully', async () => {
      const performanceId = 1
      const beneficiary = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const percentage = 5
      mockClarity.contracts['holo-rights'].functions['update-royalties'].mockReturnValue({ success: true })
      
      const result = await callContract('holo-rights', 'update-royalties', [performanceId, beneficiary, percentage])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not the creator', async () => {
      const performanceId = 1
      const beneficiary = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const percentage = 5
      mockClarity.contracts['holo-rights'].functions['update-royalties'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('holo-rights', 'update-royalties', [performanceId, beneficiary, percentage])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-performance', () => {
    it('should return performance details', async () => {
      const performanceId = 1
      const expectedPerformance = {
        creator: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        title: 'Holographic Concert',
        description: 'A mesmerizing holographic music performance',
        creation_date: 123456,
        royalty_percentage: 10
      }
      mockClarity.contracts['holo-rights'].functions['get-performance'].mockReturnValue(expectedPerformance)
      
      const result = await callContract('holo-rights', 'get-performance', [performanceId])
      
      expect(result).toEqual(expectedPerformance)
    })
    
    it('should return null for non-existent performance', async () => {
      const performanceId = 999
      mockClarity.contracts['holo-rights'].functions['get-performance'].mockReturnValue(null)
      
      const result = await callContract('holo-rights', 'get-performance', [performanceId])
      
      expect(result).toBeNull()
    })
  })
  
  describe('get-royalty', () => {
    it('should return royalty details', async () => {
      const performanceId = 1
      const beneficiary = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const expectedRoyalty = { percentage: 10 }
      mockClarity.contracts['holo-rights'].functions['get-royalty'].mockReturnValue(expectedRoyalty)
      
      const result = await callContract('holo-rights', 'get-royalty', [performanceId, beneficiary])
      
      expect(result).toEqual(expectedRoyalty)
    })
    
    it('should return null for non-existent royalty', async () => {
      const performanceId = 999
      const beneficiary = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['holo-rights'].functions['get-royalty'].mockReturnValue(null)
      
      const result = await callContract('holo-rights', 'get-royalty', [performanceId, beneficiary])
      
      expect(result).toBeNull()
    })
  })
  
  describe('pay-royalties', () => {
    it('should pay royalties successfully', async () => {
      const performanceId = 1
      const amount = 1000
      mockClarity.contracts['holo-rights'].functions['pay-royalties'].mockReturnValue({ success: true, value: 100 })
      
      const result = await callContract('holo-rights', 'pay-royalties', [performanceId, amount])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(100)
    })
    
    it('should fail for non-existent performance', async () => {
      const performanceId = 999
      const amount = 1000
      mockClarity.contracts['holo-rights'].functions['pay-royalties'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('holo-rights', 'pay-royalties', [performanceId, amount])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
})

