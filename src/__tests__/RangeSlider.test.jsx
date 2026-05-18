import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RangeSlider from '../components/RangeSlider'

describe('RangeSlider', () => {
	it('renders a range input', () => {
		render(<RangeSlider min="4" max="24" value={10} onChange={() => {}} />)
		expect(screen.getByRole('slider')).toBeInTheDocument()
	})

	it('has correct min attribute', () => {
		render(<RangeSlider min="4" max="24" value={10} onChange={() => {}} />)
		expect(screen.getByRole('slider')).toHaveAttribute('min', '4')
	})

	it('has correct max attribute', () => {
		render(<RangeSlider min="4" max="24" value={10} onChange={() => {}} />)
		expect(screen.getByRole('slider')).toHaveAttribute('max', '24')
	})

	it('has correct value attribute', () => {
		render(<RangeSlider min="4" max="24" value={15} onChange={() => {}} />)
		expect(screen.getByRole('slider')).toHaveAttribute('value', '15')
	})

	it('fires onChange when value changes', () => {
		const handleChange = vi.fn()
		render(<RangeSlider min="4" max="24" value={10} onChange={handleChange} />)
		const slider = screen.getByRole('slider')
		fireEvent.change(slider, { target: { value: '15' } })
		expect(handleChange).toHaveBeenCalledTimes(1)
	})
})
