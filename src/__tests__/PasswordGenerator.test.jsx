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

	it('renders all child components', () => {
		render(<PasswordGenerator />)
		expect(screen.getByRole('slider')).toBeInTheDocument()
		expect(screen.getByText('Character Length')).toBeInTheDocument()
		expect(screen.getByText('Include Lowercase Letters')).toBeInTheDocument()
		expect(screen.getByText('Include Uppercase Letters')).toBeInTheDocument()
		expect(screen.getByText('Include Numbers')).toBeInTheDocument()
		expect(screen.getByText('Include Symbols')).toBeInTheDocument()
		expect(screen.getByText('STRENGTH')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Generate password' })).toBeInTheDocument()
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

	it('clicking GENERATE button triggers new password', () => {
		render(<PasswordGenerator />)
		const generateButton = screen.getByRole('button', { name: 'Generate password' })
		const initialText = screen.getByText(/^[a-z]+$/).textContent
		fireEvent.click(generateButton)
		const newText = screen.getByText(/^[a-z]+$/).textContent
		expect(newText).not.toBe(initialText)
	})

	it('copy button shows copy icon after generating', () => {
		render(<PasswordGenerator />)
		const generateButton = screen.getByRole('button', { name: 'Generate password' })
		fireEvent.click(generateButton)
		expect(screen.getByTitle('Copy')).toBeInTheDocument()
	})
})
