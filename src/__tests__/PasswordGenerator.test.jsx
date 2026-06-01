import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import PasswordGenerator from '../components/PasswordGenerator'

describe('PasswordGenerator', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('renders mode selector and generate button', async () => {
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		expect(screen.getByText('Random (Characters)')).toBeInTheDocument()
		expect(screen.getByText('Easy to Remember (Words)')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Generate password' })).toBeInTheDocument()
		expect(screen.getByText('STRENGTH')).toBeInTheDocument()
	})

	it('shows character options by default', async () => {
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		expect(screen.getByText('Character Length')).toBeInTheDocument()
		expect(screen.getByText('Include Lowercase Letters')).toBeInTheDocument()
	})

	it('lowercase checkbox is checked by default', async () => {
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		const checkbox = screen.getByLabelText('Include Lowercase Letters')
		expect(checkbox).toBeChecked()
	})

	it('lowercase checkbox is disabled when it is the only active charset', async () => {
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		const checkbox = screen.getByLabelText('Include Lowercase Letters')
		expect(checkbox).toBeDisabled()
	})

	it('lowercase checkbox can be unchecked when another charset is active', async () => {
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		const uppercaseCheckbox = screen.getByLabelText('Include Uppercase Letters')
		fireEvent.click(uppercaseCheckbox)
		await act(async () => {
			await Promise.resolve()
		})
		const lowercaseCheckbox = screen.getByLabelText('Include Lowercase Letters')
		fireEvent.click(lowercaseCheckbox)
		await act(async () => {
			await Promise.resolve()
		})
		expect(lowercaseCheckbox).not.toBeChecked()
	})

	it('toggling uppercase checkbox updates state', async () => {
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		const checkbox = screen.getByLabelText('Include Uppercase Letters')
		fireEvent.click(checkbox)
		await act(async () => {
			await Promise.resolve()
		})
		expect(checkbox).toBeChecked()
	})

	it('toggling numbers checkbox updates state', async () => {
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		const checkbox = screen.getByLabelText('Include Numbers')
		fireEvent.click(checkbox)
		await act(async () => {
			await Promise.resolve()
		})
		expect(checkbox).toBeChecked()
	})

	it('toggling symbols checkbox updates state', async () => {
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		const checkbox = screen.getByLabelText('Include Symbols')
		fireEvent.click(checkbox)
		await act(async () => {
			await Promise.resolve()
		})
		expect(checkbox).toBeChecked()
	})

	it('toggling exclude ambiguous checkbox updates state', async () => {
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		const checkbox = screen.getByLabelText('Exclude Ambiguous Characters (0OIl1|)')
		fireEvent.click(checkbox)
		await act(async () => {
			await Promise.resolve()
		})
		expect(checkbox).toBeChecked()
	})

	it('slider changes password length', async () => {
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		const slider = screen.getByLabelText('Password length')
		fireEvent.change(slider, { target: { value: '20' } })
		await act(async () => {
			await Promise.resolve()
		})
		expect(slider.value).toBe('20')
	})

	it('switches to passphrase mode and shows passphrase options', async () => {
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		fireEvent.click(screen.getByText('Easy to Remember (Words)'))
		await act(async () => {
			await Promise.resolve()
		})
		expect(screen.getByText('Word Count')).toBeInTheDocument()
		expect(screen.getByText('Separator')).toBeInTheDocument()
		expect(screen.getByLabelText('Dictionary language')).toBeInTheDocument()
	})

	it('switches back to characters mode from passphrase mode', async () => {
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		fireEvent.click(screen.getByText('Easy to Remember (Words)'))
		await act(async () => {
			await Promise.resolve()
		})
		fireEvent.click(screen.getByText('Random (Characters)'))
		await act(async () => {
			await Promise.resolve()
		})
		expect(screen.getByText('Character Length')).toBeInTheDocument()
	})

	it('generates passphrase when in passphrase mode', async () => {
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		fireEvent.click(screen.getByText('Easy to Remember (Words)'))
		await act(async () => {
			await Promise.resolve()
		})
		const generateButton = screen.getByRole('button', { name: 'Generate password' })
		fireEvent.click(generateButton)
		await act(async () => {
			await Promise.resolve()
		})
		expect(screen.getByLabelText('Generated password').textContent).not.toBe('')
	})

	it('renders history section', async () => {
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		expect(screen.getByText('HISTORY')).toBeInTheDocument()
	})

	it('copy button is present after generating', async () => {
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		const copyButton = screen.getByLabelText('Copy password to clipboard')
		expect(copyButton).toBeInTheDocument()
	})

	it('opens settings dialog when clicking settings button', async () => {
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		fireEvent.click(screen.getByLabelText('Open settings'))
		await act(async () => {
			await Promise.resolve()
		})
		expect(screen.getByText('Clipboard auto-clear:')).toBeInTheDocument()
	})

	it('shows clipboard auto-clear option in settings', async () => {
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		fireEvent.click(screen.getByLabelText('Open settings'))
		await act(async () => {
			await Promise.resolve()
		})
		expect(screen.getByText('Clipboard auto-clear:')).toBeInTheDocument()
	})

	it('shows permission button when clipboard permission is denied', async () => {
		navigator.permissions.query.mockResolvedValue({ state: 'denied' })
		navigator.clipboard.writeText.mockRejectedValue(new Error('Permission denied'))
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		fireEvent.click(screen.getByLabelText('Open settings'))
		await act(async () => {
			await Promise.resolve()
		})
		expect(screen.getByText('Allow clipboard access to enable')).toBeInTheDocument()
	})

	it('does not show countdown when clipboard timeout is 0', async () => {
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		expect(screen.queryByText(/Clipboard clears in/)).not.toBeInTheDocument()
	})

	it('triggers clipboard write when copying', async () => {
		render(<PasswordGenerator />)
		await act(async () => {
			await Promise.resolve()
		})
		fireEvent.click(screen.getByRole('button', { name: 'Generate password' }))
		await act(async () => {
			await Promise.resolve()
		})
		fireEvent.click(screen.getByLabelText('Copy password to clipboard'))
		await act(async () => {
			await Promise.resolve()
		})
		expect(navigator.clipboard.writeText).toHaveBeenCalled()
	})
})