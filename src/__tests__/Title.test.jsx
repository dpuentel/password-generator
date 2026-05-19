import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Title from '../components/Title'

describe('Title', () => {
	it('renders the given text as h1', () => {
		render(<Title text='My Title' />)
		const heading = screen.getByRole('heading', { level: 1 })
		expect(heading).toHaveTextContent('My Title')
	})

	it('applies correct styling classes', () => {
		render(<Title text='Styled Title' />)
		const heading = screen.getByRole('heading', { level: 1 })
		expect(heading.className).toContain('text-xl')
		expect(heading.className).toContain('font-bold')
	})
})
