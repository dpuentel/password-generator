import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PasswordStrength from '../components/PasswordStrength'

describe('PasswordStrength', () => {
	it('renders 10 strength bars', () => {
		render(<PasswordStrength password='test' />)
		const bars = document.querySelectorAll('.grid-cols-10 span')
		expect(bars.length).toBe(10)
	})

	it('renders STRENGTH label', () => {
		render(<PasswordStrength password='test' />)
		expect(screen.getByText('STRENGTH')).toBeInTheDocument()
	})

	it('shows no filled bars for empty password', () => {
		render(<PasswordStrength password='' />)
		const bars = document.querySelectorAll('.grid-cols-10 span')
		const filledBars = Array.from(bars).filter(
			(bar) => bar.className && bar.className.includes('bg-gray-300')
		)
		expect(filledBars.length).toBe(0)
	})

	it('shows some filled bars for a weak password', () => {
		render(<PasswordStrength password='abc' />)
		const bars = document.querySelectorAll('.grid-cols-10 span')
		const filledBars = Array.from(bars).filter(
			(bar) => bar.className && bar.className.includes('bg-gray-300')
		)
		expect(filledBars.length).toBeGreaterThan(0)
	})

	it('shows more filled bars for a strong password than a weak one', () => {
		const { rerender } = render(<PasswordStrength password='ab' />)
		const weakBars = document.querySelectorAll('.grid-cols-10 span.bg-gray-300').length

		rerender(<PasswordStrength password='aB1!xY9@kL2#' />)
		const strongBars = document.querySelectorAll('.grid-cols-10 span.bg-gray-300').length

		expect(strongBars).toBeGreaterThan(weakBars)
	})
})
