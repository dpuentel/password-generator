import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import PasswordResult from '../components/PasswordResult'

describe('PasswordResult', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('renders placeholder when no password is provided', () => {
		render(<PasswordResult password="" placeholder="P4$5W0rD!" />)
		expect(screen.getByText('P4$5W0rD!')).toBeInTheDocument()
	})

	it('renders password when provided', () => {
		render(<PasswordResult password="abc123" placeholder="P4$5W0rD!" />)
		expect(screen.getByText('abc123')).toBeInTheDocument()
	})

	it('shows copy icon initially', () => {
		render(<PasswordResult password="test" placeholder="P4$5W0rD!" />)
		expect(screen.getByTitle('Copy')).toBeInTheDocument()
	})

	it('calls navigator.clipboard.writeText on copy', async () => {
		render(<PasswordResult password="secret123" placeholder="P4$5W0rD!" />)
		fireEvent.click(screen.getByRole('button'))
		await act(async () => {
			await Promise.resolve()
		})
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith('secret123')
	})

	it('shows check icon after copying', async () => {
		render(<PasswordResult password="test" placeholder="P4$5W0rD!" />)
		fireEvent.click(screen.getByRole('button'))
		await act(async () => {
			await Promise.resolve()
		})
		expect(screen.getByTitle('Checkmark Done')).toBeInTheDocument()
	})

	it('reverts to copy icon after 1 second', async () => {
		render(<PasswordResult password="test" placeholder="P4$5W0rD!" />)
		fireEvent.click(screen.getByRole('button'))
		await act(async () => {
			await Promise.resolve()
		})
		expect(screen.getByTitle('Checkmark Done')).toBeInTheDocument()

		act(() => {
			vi.advanceTimersByTime(1000)
		})
		expect(screen.getByTitle('Copy')).toBeInTheDocument()
	})

	it('applies underline class when copied', async () => {
		render(<PasswordResult password="test" placeholder="P4$5W0rD!" />)
		fireEvent.click(screen.getByRole('button'))
		await act(async () => {
			await Promise.resolve()
		})
		const textElement = screen.getByText('test')
		expect(textElement.className).toContain('underline')
	})
})
