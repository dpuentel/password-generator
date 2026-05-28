import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import RelativeTime from '../components/RelativeTime'

describe('RelativeTime', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date('2025-01-15T12:00:00Z'))
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('shows "Just now" for timestamps less than 1 minute ago', () => {
		const timestamp = Date.now() - 30 * 1000
		render(<RelativeTime timestamp={timestamp} />)
		expect(screen.getByText('Just now')).toBeInTheDocument()
	})

	it('shows minutes ago for timestamps less than 1 hour ago', () => {
		const timestamp = Date.now() - 5 * 60 * 1000
		render(<RelativeTime timestamp={timestamp} />)
		expect(screen.getByText('5 min ago')).toBeInTheDocument()
	})

	it('shows hours ago for timestamps less than 24 hours ago', () => {
		const timestamp = Date.now() - 3 * 60 * 60 * 1000
		render(<RelativeTime timestamp={timestamp} />)
		expect(screen.getByText('3 hours ago')).toBeInTheDocument()
	})

	it('shows singular "hour" for 1 hour ago', () => {
		const timestamp = Date.now() - 60 * 60 * 1000
		render(<RelativeTime timestamp={timestamp} />)
		expect(screen.getByText('1 hour ago')).toBeInTheDocument()
	})

	it('shows "Yesterday" for timestamps between 24 and 48 hours ago', () => {
		const timestamp = Date.now() - 30 * 60 * 60 * 1000
		render(<RelativeTime timestamp={timestamp} />)
		expect(screen.getByText('Yesterday')).toBeInTheDocument()
	})

	it('shows days ago for timestamps more than 48 hours ago', () => {
		const timestamp = Date.now() - 5 * 24 * 60 * 60 * 1000
		render(<RelativeTime timestamp={timestamp} />)
		expect(screen.getByText('5 days ago')).toBeInTheDocument()
	})

	it('shows absolute date in title attribute', () => {
		const timestamp = new Date('2025-01-15T10:30:00Z').getTime()
		render(<RelativeTime timestamp={timestamp} />)
		const element = screen.getByText('1 hour ago')
		expect(element.closest('[title]')).toHaveAttribute('title', expect.any(String))
	})

	it('renders with prefix', () => {
		const timestamp = Date.now() - 5 * 60 * 1000
		render(<RelativeTime timestamp={timestamp} prefix='Generated ' />)
		expect(screen.getByText('Generated 5 min ago')).toBeInTheDocument()
	})

	it('renders without prefix by default', () => {
		const timestamp = Date.now() - 5 * 60 * 1000
		render(<RelativeTime timestamp={timestamp} />)
		expect(screen.getByText('5 min ago')).toBeInTheDocument()
	})
})
