import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PasswordStrength from '../components/PasswordStrength'
import { PasswordEntropyCalculator, PassphraseEntropyCalculator } from '../services/PasswordEntropyCalculator'

describe('PasswordStrength', () => {
	it('renders 10 strength bars', () => {
		render(<PasswordStrength entropy={10} maxEntropy={426} />)
		const bars = document.querySelectorAll('.grid-cols-10 span')
		expect(bars.length).toBe(10)
	})

	it('renders STRENGTH label', () => {
		render(<PasswordStrength entropy={10} maxEntropy={426} />)
		expect(screen.getByText('STRENGTH')).toBeInTheDocument()
	})

	it('shows no filled bars for zero entropy', () => {
		render(<PasswordStrength entropy={0} maxEntropy={426} />)
		const bars = document.querySelectorAll('.grid-cols-10 span')
		const filledBars = Array.from(bars).filter(
			(bar) => bar.className && !bar.className.includes('bg-slate-900')
		)
		expect(filledBars.length).toBe(0)
	})

	it('shows Weak label for low entropy', () => {
		const entropy = PasswordEntropyCalculator('ab')
		render(<PasswordStrength entropy={entropy} maxEntropy={426} />)
		expect(screen.getByText('Weak')).toBeInTheDocument()
	})

	it('shows Fair label for medium entropy', () => {
		const entropy = PasswordEntropyCalculator('abcdefghijAB1')
		render(<PasswordStrength entropy={entropy} maxEntropy={426} />)
		expect(screen.getByText('Fair')).toBeInTheDocument()
	})

	it('shows Strong label for high entropy', () => {
		const entropy = PasswordEntropyCalculator('aB1!xY9@kL')
		render(<PasswordStrength entropy={entropy} maxEntropy={426} />)
		expect(screen.getByText('Strong')).toBeInTheDocument()
	})

	it('shows Very Strong label for very high entropy', () => {
		const entropy = PasswordEntropyCalculator('aB1!xY9@kL2#mN4&Pq6*rT8!')
		render(<PasswordStrength entropy={entropy} maxEntropy={426} />)
		expect(screen.getByText('Very Strong')).toBeInTheDocument()
	})

	it('shows no strength label for zero entropy', () => {
		render(<PasswordStrength entropy={0} maxEntropy={426} />)
		expect(screen.queryByText('Weak')).not.toBeInTheDocument()
		expect(screen.queryByText('Fair')).not.toBeInTheDocument()
		expect(screen.queryByText('Strong')).not.toBeInTheDocument()
		expect(screen.queryByText('Very Strong')).not.toBeInTheDocument()
	})

	it('uses red color for Weak', () => {
		const entropy = PasswordEntropyCalculator('ab')
		render(<PasswordStrength entropy={entropy} maxEntropy={426} />)
		const bars = document.querySelectorAll('.grid-cols-10 span')
		const filledBars = Array.from(bars).filter(
			(bar) => bar.className && bar.className.includes('bg-red-500')
		)
		expect(filledBars.length).toBeGreaterThan(0)
	})

	it('uses green color for Very Strong', () => {
		const entropy = PasswordEntropyCalculator('aB1!xY9@kL2#mN4&Pq6*rT8!')
		render(<PasswordStrength entropy={entropy} maxEntropy={426} />)
		const bars = document.querySelectorAll('.grid-cols-10 span')
		const filledBars = Array.from(bars).filter(
			(bar) => bar.className && bar.className.includes('bg-green-500')
		)
		expect(filledBars.length).toBeGreaterThan(0)
	})

	it('works with passphrase entropy', () => {
		const entropy = PassphraseEntropyCalculator(4, 2048)
		render(<PasswordStrength entropy={entropy} maxEntropy={77} />)
		expect(screen.getByText('Strong')).toBeInTheDocument()
	})

	it('uses default props when none provided', () => {
		render(<PasswordStrength />)
		const bars = document.querySelectorAll('.grid-cols-10 span')
		expect(bars.length).toBe(10)
		expect(screen.queryByText('Weak')).not.toBeInTheDocument()
	})
})
