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
		render(<PasswordResult password='' placeholder='P4$5W0rD!' />)
		expect(screen.getByText('P4$5W0rD!')).toBeInTheDocument()
	})

	it('renders password when provided', () => {
		render(<PasswordResult password='abc123' placeholder='P4$5W0rD!' />)
		expect(screen.getByText('abc123')).toBeInTheDocument()
	})

	it('shows copy icon initially', () => {
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' />)
		expect(screen.getByTitle('Copy')).toBeInTheDocument()
	})

	it('calls navigator.clipboard.writeText on copy', async () => {
		render(<PasswordResult password='secret123' placeholder='P4$5W0rD!' />)
		fireEvent.click(screen.getByRole('button'))
		await act(async () => {
			await Promise.resolve()
		})
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith('secret123')
	})

	it('shows check icon after copying', async () => {
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' />)
		fireEvent.click(screen.getByRole('button'))
		await act(async () => {
			await Promise.resolve()
		})
		expect(screen.getByTitle('Checkmark Done')).toBeInTheDocument()
	})

	it('reverts to copy icon after 1 second', async () => {
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' />)
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
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' />)
		fireEvent.click(screen.getByRole('button'))
		await act(async () => {
			await Promise.resolve()
		})
		const textElement = screen.getByText('test')
		expect(textElement.className).toContain('underline')
	})

	it('has aria-label for copy button', () => {
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' />)
		expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Copy password to clipboard')
	})

	it('has aria-live on password text', () => {
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' />)
		const textElement = screen.getByText('test')
		expect(textElement).toHaveAttribute('aria-live', 'polite')
	})

	it('has region role with aria-label', () => {
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' />)
		expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'Generated password')
	})

	it('shows error indicator when clipboard write fails', async () => {
		navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Clipboard error'))
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' />)
		fireEvent.click(screen.getByRole('button'))
		await act(async () => {
			await Promise.resolve()
		})
		expect(screen.getByLabelText('Copy failed')).toBeInTheDocument()
	})

	it('reverts error indicator after 1 second', async () => {
		navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Clipboard error'))
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' />)
		fireEvent.click(screen.getByRole('button'))
		await act(async () => {
			await Promise.resolve()
		})
		expect(screen.getByLabelText('Copy failed')).toBeInTheDocument()

		act(() => {
			vi.advanceTimersByTime(1000)
		})
		expect(screen.queryByLabelText('Copy failed')).not.toBeInTheDocument()
	})

	it('selects password text on click', () => {
		const getSelectionSpy = vi.spyOn(window, 'getSelection').mockReturnValue({
			selectAllChildren: vi.fn()
		})
		render(<PasswordResult password='mySecretPass' placeholder='P4$5W0rD!' />)
		const textSpan = screen.getByText('mySecretPass')
		fireEvent.click(textSpan)
		expect(getSelectionSpy).toHaveBeenCalled()
		getSelectionSpy.mockRestore()
	})

	it('does not select text on click when password is empty', () => {
		const getSelectionSpy = vi.spyOn(window, 'getSelection')
		render(<PasswordResult password='' placeholder='P4$5W0rD!' />)
		const textSpan = screen.getByText('P4$5W0rD!')
		fireEvent.click(textSpan)
		expect(getSelectionSpy).not.toHaveBeenCalled()
		getSelectionSpy.mockRestore()
	})

	it('has aria-label for click to select when password exists', () => {
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' />)
		expect(screen.getByText('test')).toHaveAttribute('aria-label', 'Click to select password')
	})

	it('does not have aria-label when password is empty', () => {
		render(<PasswordResult password='' placeholder='P4$5W0rD!' />)
		expect(screen.getByText('P4$5W0rD!')).not.toHaveAttribute('aria-label', 'Click to select password')
	})
})
