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
			(bar) => bar.className && !bar.className.includes('bg-slate-900')
		)
		expect(filledBars.length).toBe(0)
	})

	it('shows Weak label for low entropy passwords', () => {
		render(<PasswordStrength password='ab' />)
		expect(screen.getByText('Weak')).toBeInTheDocument()
	})

	it('shows Fair label for medium entropy passwords', () => {
		render(<PasswordStrength password='abcdefghijAB1' />)
		expect(screen.getByText('Fair')).toBeInTheDocument()
	})

	it('shows Strong label for high entropy passwords', () => {
		render(<PasswordStrength password='aB1!xY9@kL' />)
		expect(screen.getByText('Strong')).toBeInTheDocument()
	})

	it('shows Very Strong label for very high entropy passwords', () => {
		render(<PasswordStrength password='aB1!xY9@kL2#mN4&Pq6*rT8!' />)
		expect(screen.getByText('Very Strong')).toBeInTheDocument()
	})

	it('shows no strength label for empty password', () => {
		render(<PasswordStrength password='' />)
		expect(screen.queryByText('Weak')).not.toBeInTheDocument()
		expect(screen.queryByText('Fair')).not.toBeInTheDocument()
		expect(screen.queryByText('Strong')).not.toBeInTheDocument()
		expect(screen.queryByText('Very Strong')).not.toBeInTheDocument()
	})

	it('uses red color for Weak', () => {
		render(<PasswordStrength password='ab' />)
		const bars = document.querySelectorAll('.grid-cols-10 span')
		const filledBars = Array.from(bars).filter(
			(bar) => bar.className && bar.className.includes('bg-red-500')
		)
		expect(filledBars.length).toBeGreaterThan(0)
	})

	it('uses green color for Very Strong', () => {
		render(<PasswordStrength password='aB1!xY9@kL2#mN4&Pq6*rT8!' />)
		const bars = document.querySelectorAll('.grid-cols-10 span')
		const filledBars = Array.from(bars).filter(
			(bar) => bar.className && bar.className.includes('bg-green-500')
		)
		expect(filledBars.length).toBeGreaterThan(0)
	})
})
