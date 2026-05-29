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

	it('shows save icon', () => {
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' />)
		expect(screen.getByTitle('Save')).toBeInTheDocument()
	})

	it('calls navigator.clipboard.writeText on copy', async () => {
		render(<PasswordResult password='secret123' placeholder='P4$5W0rD!' />)
		fireEvent.click(screen.getByLabelText('Copy password to clipboard'))
		await act(async () => {
			await Promise.resolve()
		})
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith('secret123')
	})

	it('shows check icon after copying', async () => {
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' />)
		fireEvent.click(screen.getByLabelText('Copy password to clipboard'))
		await act(async () => {
			await Promise.resolve()
		})
		expect(screen.getByTitle('Checkmark Done')).toBeInTheDocument()
	})

	it('reverts to copy icon after 1 second', async () => {
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' />)
		fireEvent.click(screen.getByLabelText('Copy password to clipboard'))
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
		fireEvent.click(screen.getByLabelText('Copy password to clipboard'))
		await act(async () => {
			await Promise.resolve()
		})
		const textElement = screen.getByText('test')
		expect(textElement.className).toContain('underline')
	})

	it('has aria-label for copy button', () => {
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' />)
		expect(screen.getByLabelText('Copy password to clipboard')).toBeInTheDocument()
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
		fireEvent.click(screen.getByLabelText('Copy password to clipboard'))
		await act(async () => {
			await Promise.resolve()
		})
		expect(screen.getByLabelText('Copy failed')).toBeInTheDocument()
	})

	it('reverts error indicator after 1 second', async () => {
		navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Clipboard error'))
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' />)
		fireEvent.click(screen.getByLabelText('Copy password to clipboard'))
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

	it('opens save dialog when clicking save button', () => {
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' />)
		fireEvent.click(screen.getByLabelText('Save password'))
		expect(screen.getByLabelText('Password name')).toBeInTheDocument()
	})

	it('calls onSave with name when saving', () => {
		const onSave = vi.fn()
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' onSave={onSave} />)
		fireEvent.click(screen.getByLabelText('Save password'))
		const input = screen.getByLabelText('Password name')
		fireEvent.change(input, { target: { value: 'My Password' } })
		const dialog = document.querySelector('dialog')
		const saveBtn = dialog.querySelector('.bg-green-600')
		fireEvent.click(saveBtn)
		expect(onSave).toHaveBeenCalledWith('My Password')
	})

	it('calls onSave with null when saving without name', () => {
		const onSave = vi.fn()
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' onSave={onSave} />)
		fireEvent.click(screen.getByLabelText('Save password'))
		const dialog = document.querySelector('dialog')
		const saveBtn = dialog.querySelector('.bg-green-600')
		fireEvent.click(saveBtn)
		expect(onSave).toHaveBeenCalledWith(null)
	})

	it('closes save dialog when clicking cancel', () => {
		const onSave = vi.fn()
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' onSave={onSave} />)
		fireEvent.click(screen.getByLabelText('Save password'))
		const dialog = document.querySelector('dialog')
		const cancelBtn = dialog.querySelector('.bg-slate-700')
		fireEvent.click(cancelBtn)
		expect(onSave).not.toHaveBeenCalled()
	})

	it('limits save name to 30 characters', () => {
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' />)
		fireEvent.click(screen.getByLabelText('Save password'))
		const input = screen.getByLabelText('Password name')
		expect(input.maxLength).toBe(30)
	})

	it('save button is disabled when no password', () => {
		render(<PasswordResult password='' placeholder='P4$5W0rD!' />)
		expect(screen.getByLabelText('Save password')).toBeDisabled()
	})

	it('saves on Enter key', () => {
		const onSave = vi.fn()
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' onSave={onSave} />)
		fireEvent.click(screen.getByLabelText('Save password'))
		const input = screen.getByLabelText('Password name')
		fireEvent.change(input, { target: { value: 'Enter Name' } })
		fireEvent.keyDown(input, { key: 'Enter' })
		expect(onSave).toHaveBeenCalledWith('Enter Name')
	})

	it('closes dialog on Escape key', () => {
		const onSave = vi.fn()
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' onSave={onSave} />)
		fireEvent.click(screen.getByLabelText('Save password'))
		const input = screen.getByLabelText('Password name')
		fireEvent.keyDown(input, { key: 'Escape' })
		expect(onSave).not.toHaveBeenCalled()
	})

	it('closes dialog on backdrop click', () => {
		const onSave = vi.fn()
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' onSave={onSave} />)
		fireEvent.click(screen.getByLabelText('Save password'))
		const dialog = document.querySelector('dialog')
		fireEvent.click(dialog)
		expect(onSave).not.toHaveBeenCalled()
	})

	it('calls onCopy when provided', async () => {
		const onCopy = vi.fn()
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' onCopy={onCopy} />)
		fireEvent.click(screen.getByLabelText('Copy password to clipboard'))
		await act(async () => {
			await Promise.resolve()
		})
		expect(onCopy).toHaveBeenCalled()
	})

	it('handles missing onCopy gracefully', async () => {
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' />)
		fireEvent.click(screen.getByLabelText('Copy password to clipboard'))
		await act(async () => {
			await Promise.resolve()
		})
	})

	it('calls dialog.close when saving', () => {
		const onSave = vi.fn()
		render(<PasswordResult password='test' placeholder='P4$5W0rD!' onSave={onSave} />)
		fireEvent.click(screen.getByLabelText('Save password'))
		const dialog = document.querySelector('dialog')
		const closeSpy = vi.spyOn(dialog, 'close')
		const saveBtn = dialog.querySelector('.bg-green-600')
		fireEvent.click(saveBtn)
		expect(closeSpy).toHaveBeenCalled()
	})
})
