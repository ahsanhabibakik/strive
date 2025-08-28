import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Newsletter } from '@/components/forms/Newsletter'

// Mock fetch
global.fetch = jest.fn()

describe('Newsletter Component', () => {
  beforeEach(() => {
    ;(fetch as jest.Mock).mockClear()
  })

  it('renders newsletter form correctly', () => {
    render(<Newsletter />)
    
    expect(screen.getByRole('heading', { name: /subscribe to newsletter/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/your email address/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
  })

  it('shows error for invalid email', async () => {
    const user = userEvent.setup()
    render(<Newsletter />)
    
    const emailInput = screen.getByPlaceholderText(/your email address/i)
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)
    
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
  })

  it('shows error when email is empty', async () => {
    const user = userEvent.setup()
    render(<Newsletter />)
    
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    await user.click(submitButton)
    
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
  })

  it('submits form successfully', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Successfully subscribed!' })
    })

    const user = userEvent.setup()
    render(<Newsletter />)
    
    const emailInput = screen.getByPlaceholderText(/your email address/i)
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText(/thank you/i)).toBeInTheDocument()
    })
  })

  it('handles API error gracefully', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Subscription failed' })
    })

    const user = userEvent.setup()
    render(<Newsletter />)
    
    const emailInput = screen.getByPlaceholderText(/your email address/i)
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/subscription failed/i)).toBeInTheDocument()
    })
  })

  it('uses custom props correctly', () => {
    const customProps = {
      title: 'Custom Newsletter',
      description: 'Custom description',
      buttonText: 'Join Now'
    }
    
    render(<Newsletter {...customProps} />)
    
    expect(screen.getByRole('heading', { name: /custom newsletter/i })).toBeInTheDocument()
    expect(screen.getByText(/custom description/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /join now/i })).toBeInTheDocument()
  })

  it('calls custom onSubscribe function', async () => {
    const mockOnSubscribe = jest.fn().mockResolvedValue(undefined)
    const user = userEvent.setup()
    
    render(<Newsletter onSubscribe={mockOnSubscribe} />)
    
    const emailInput = screen.getByPlaceholderText(/your email address/i)
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnSubscribe).toHaveBeenCalledWith('test@example.com')
    })
  })
})