import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PasswordGenerator from '../components/PasswordGenerator'

describe('PasswordGenerator', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('renders mode selector and generate button', () => {
		render(<PasswordGenerator />)
		expect(screen.getByText('Random (Characters)')).toBeInTheDocument()
		expect(screen.getByText('Easy to Remember (Words)')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Generate password' })).toBeInTheDocument()
		expect(screen.getByText('STRENGTH')).toBeInTheDocument()
	})

	it('shows character options by default', () => {
		render(<PasswordGenerator />)
		expect(screen.getByText('Character Length')).toBeInTheDocument()
		expect(screen.getByText('Include Lowercase Letters')).toBeInTheDocument()
	})

	it('lowercase checkbox is checked by default', () => {
		render(<PasswordGenerator />)
		const checkbox = screen.getByLabelText('Include Lowercase Letters')
		expect(checkbox).toBeChecked()
	})

	it('lowercase checkbox is disabled when it is the only active charset', () => {
		render(<PasswordGenerator />)
		const checkbox = screen.getByLabelText('Include Lowercase Letters')
		expect(checkbox).toBeDisabled()
	})

	it('lowercase checkbox can be unchecked when another charset is active', () => {
		render(<PasswordGenerator />)
		const uppercaseCheckbox = screen.getByLabelText('Include Uppercase Letters')
		fireEvent.click(uppercaseCheckbox)
		const lowercaseCheckbox = screen.getByLabelText('Include Lowercase Letters')
		fireEvent.click(lowercaseCheckbox)
		expect(lowercaseCheckbox).not.toBeChecked()
	})

	it('toggling uppercase checkbox updates state', () => {
		render(<PasswordGenerator />)
		const checkbox = screen.getByLabelText('Include Uppercase Letters')
		fireEvent.click(checkbox)
		expect(checkbox).toBeChecked()
	})

	it('toggling numbers checkbox updates state', () => {
		render(<PasswordGenerator />)
		const checkbox = screen.getByLabelText('Include Numbers')
		fireEvent.click(checkbox)
		expect(checkbox).toBeChecked()
	})

	it('toggling symbols checkbox updates state', () => {
		render(<PasswordGenerator />)
		const checkbox = screen.getByLabelText('Include Symbols')
		fireEvent.click(checkbox)
		expect(checkbox).toBeChecked()
	})

	it('toggling exclude ambiguous checkbox updates state', () => {
		render(<PasswordGenerator />)
		const checkbox = screen.getByLabelText('Exclude Ambiguous Characters (0OIl1|)')
		fireEvent.click(checkbox)
		expect(checkbox).toBeChecked()
	})

	it('slider changes password length', () => {
		render(<PasswordGenerator />)
		const slider = screen.getByLabelText('Password length')
		fireEvent.change(slider, { target: { value: '20' } })
		expect(slider.value).toBe('20')
	})

	it('switches to passphrase mode and shows passphrase options', () => {
		render(<PasswordGenerator />)
		fireEvent.click(screen.getByText('Easy to Remember (Words)'))
		expect(screen.getByText('Word Count')).toBeInTheDocument()
		expect(screen.getByText('Separator')).toBeInTheDocument()
		expect(screen.getByLabelText('Dictionary language')).toBeInTheDocument()
	})

	it('switches back to characters mode from passphrase mode', () => {
		render(<PasswordGenerator />)
		fireEvent.click(screen.getByText('Easy to Remember (Words)'))
		fireEvent.click(screen.getByText('Random (Characters)'))
		expect(screen.getByText('Character Length')).toBeInTheDocument()
	})

	it('generates passphrase when in passphrase mode', () => {
		render(<PasswordGenerator />)
		fireEvent.click(screen.getByText('Easy to Remember (Words)'))
		const generateButton = screen.getByRole('button', { name: 'Generate password' })
		fireEvent.click(generateButton)
		expect(screen.getByLabelText('Generated password').textContent).not.toBe('')
	})

	it('renders history section', () => {
		render(<PasswordGenerator />)
		expect(screen.getByText('HISTORY')).toBeInTheDocument()
	})

	it('copy button is present after generating', () => {
		render(<PasswordGenerator />)
		const copyButton = screen.getByLabelText('Copy password to clipboard')
		expect(copyButton).toBeInTheDocument()
	})
})
