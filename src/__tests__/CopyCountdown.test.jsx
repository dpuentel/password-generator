import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CopyCountdown from '../components/CopyCountdown'

describe('CopyCountdown', () => {
	it('renders nothing when remaining and total are 0', () => {
		render(<CopyCountdown remaining={0} total={0} />)
		expect(screen.queryByText(/Clipboard clears in/)).not.toBeInTheDocument()
	})

	it('shows countdown text when remaining > 0 and total > 0', () => {
		render(<CopyCountdown remaining={30} total={60} />)
		expect(screen.getByText('Clipboard clears in 30s')).toBeInTheDocument()
	})

	it('displays progress bar with correct width percentage', () => {
		render(<CopyCountdown remaining={30} total={60} />)
		const progressBar = screen.getByLabelText('Clipboard clear progress')
		expect(progressBar).toHaveStyle({ width: '50%' })
	})

	it('shows warning message when provided', () => {
		render(<CopyCountdown remaining={0} total={0} warning='Permission denied' />)
		expect(screen.getByText('Permission denied')).toBeInTheDocument()
	})

	it('does not show warning when not provided', () => {
		render(<CopyCountdown remaining={0} total={0} />)
		expect(screen.queryByText('Permission denied')).not.toBeInTheDocument()
	})

	it('renders with different remaining values', () => {
		render(<CopyCountdown remaining={5} total={10} />)
		expect(screen.getByText('Clipboard clears in 5s')).toBeInTheDocument()
		const progressBar = screen.getByRole('progressbar')
		expect(progressBar).toHaveStyle({ width: '50%' })
	})
})
