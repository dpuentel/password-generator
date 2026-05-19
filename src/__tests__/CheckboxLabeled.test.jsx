import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CheckboxLabeled from '../components/CheckboxLabeled'

describe('CheckboxLabeled', () => {
	it('renders the label text', () => {
		render(<CheckboxLabeled label='Test Label' checked={false} onChange={() => {}} />)
		expect(screen.getByText('Test Label')).toBeInTheDocument()
	})

	it('checkbox reflects checked prop as true', () => {
		render(<CheckboxLabeled label='Checked' checked={true} onChange={() => {}} />)
		expect(screen.getByRole('checkbox')).toBeChecked()
	})

	it('checkbox reflects checked prop as false', () => {
		render(<CheckboxLabeled label='Unchecked' checked={false} onChange={() => {}} />)
		expect(screen.getByRole('checkbox')).not.toBeChecked()
	})

	it('fires onChange when clicked', async () => {
		const handleChange = vi.fn()
		const user = userEvent.setup()
		render(<CheckboxLabeled label='Toggle' checked={false} onChange={handleChange} />)
		await user.click(screen.getByRole('checkbox'))
		expect(handleChange).toHaveBeenCalledTimes(1)
	})
})
