/**
 * @jest-environment node
 */

import { POST } from '@/app/api/newsletter/subscribe/route'
import { NextRequest } from 'next/server'

// Mock MongoDB
jest.mock('mongodb', () => ({
  MongoClient: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    close: jest.fn(),
    db: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        findOne: jest.fn(),
        insertOne: jest.fn(),
      }),
    }),
  })),
}))

describe('/api/newsletter/subscribe', () => {
  const mockRequest = (body: any) => {
    return {
      json: jest.fn().mockResolvedValue(body),
    } as unknown as NextRequest
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('successfully subscribes valid email', async () => {
    const { MongoClient } = require('mongodb')
    const mockClient = new MongoClient()
    const mockCollection = {
      findOne: jest.fn().mockResolvedValue(null),
      insertOne: jest.fn().mockResolvedValue({}),
    }
    mockClient.db().collection.mockReturnValue(mockCollection)

    const request = mockRequest({ email: 'test@example.com' })
    const response = await POST(request)
    const result = await response.json()

    expect(response.status).toBe(200)
    expect(result.message).toBe('Successfully subscribed to newsletter!')
  })

  it('rejects invalid email format', async () => {
    const request = mockRequest({ email: 'invalid-email' })
    const response = await POST(request)
    const result = await response.json()

    expect(response.status).toBe(400)
    expect(result.error).toBe('Invalid email format')
  })

  it('rejects missing email', async () => {
    const request = mockRequest({})
    const response = await POST(request)
    const result = await response.json()

    expect(response.status).toBe(400)
    expect(result.error).toContain('Required')
  })

  it('handles duplicate email subscription', async () => {
    const { MongoClient } = require('mongodb')
    const mockClient = new MongoClient()
    const mockCollection = {
      findOne: jest.fn().mockResolvedValue({ email: 'test@example.com' }),
      insertOne: jest.fn(),
    }
    mockClient.db().collection.mockReturnValue(mockCollection)

    const request = mockRequest({ email: 'test@example.com' })
    const response = await POST(request)
    const result = await response.json()

    expect(response.status).toBe(409)
    expect(result.error).toBe('Email already subscribed')
  })

  it('handles database errors gracefully', async () => {
    const { MongoClient } = require('mongodb')
    const mockClient = new MongoClient()
    mockClient.connect.mockRejectedValue(new Error('Database connection failed'))

    const request = mockRequest({ email: 'test@example.com' })
    const response = await POST(request)
    const result = await response.json()

    expect(response.status).toBe(500)
    expect(result.error).toBe('Internal server error')
  })
})