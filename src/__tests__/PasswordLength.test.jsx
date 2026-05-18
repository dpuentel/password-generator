import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PasswordLength from '../components/PasswordLength'

describe('PasswordLength', () => {
	it('renders the length value', () => {
		render(<PasswordLength length={12} />)
		expect(screen.getByText('12')).toBeInTheDocument()
	})

	it('renders the label text', () => {
		render(<PasswordLength length={8} />)
		expect(screen.getByText('Character Length')).toBeInTheDocument()
	})

	it('renders different length values', () => {
		const { rerender } = render(<PasswordLength length={4} />)
		expect(screen.getByText('4')).toBeInTheDocument()

		rerender(<PasswordLength length={24} />)
		expect(screen.getByText('24')).toBeInTheDocument()
	})
})
