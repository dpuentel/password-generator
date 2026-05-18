import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../components/Button'

describe('Button', () => {
	it('renders with the given text', () => {
		render(<Button text="Click Me" onClick={() => {}} />)
		expect(screen.getByRole('button')).toHaveTextContent('Click Me')
	})

	it('fires onClick handler when clicked', async () => {
		const handleClick = vi.fn()
		const user = userEvent.setup()
		render(<Button text="Submit" onClick={handleClick} />)
		await user.click(screen.getByRole('button'))
		expect(handleClick).toHaveBeenCalledTimes(1)
	})
})
