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
		expect(screen.getByText('Include Uppercase Letters')).toBeInTheDocument()
		expect(screen.getByText('Include Numbers')).toBeInTheDocument()
		expect(screen.getByText('Include Symbols')).toBeInTheDocument()
		expect(screen.getByText('STRENGTH')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /GENERATE/ })).toBeInTheDocument()
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
		const generateButton = screen.getByRole('button', { name: /GENERATE/ })
		const initialText = screen.getByText(/^[a-z]+$/).textContent
		fireEvent.click(generateButton)
		const newText = screen.getByText(/^[a-z]+$/).textContent
		expect(newText).not.toBe(initialText)
	})

	it('copy button shows copy icon after generating', () => {
		render(<PasswordGenerator />)
		const generateButton = screen.getByRole('button', { name: /GENERATE/ })
		fireEvent.click(generateButton)
		expect(screen.getByTitle('Copy')).toBeInTheDocument()
	})
})
