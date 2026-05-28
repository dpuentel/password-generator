import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ModeSelector from '../components/ModeSelector'

describe('ModeSelector', () => {
	it('renders both mode buttons', () => {
		render(<ModeSelector mode='characters' setMode={vi.fn()} />)
		expect(screen.getByText('Random (Characters)')).toBeInTheDocument()
		expect(screen.getByText('Easy to Remember (Words)')).toBeInTheDocument()
	})

	it('highlights characters mode when active', () => {
		render(<ModeSelector mode='characters' setMode={vi.fn()} />)
		const charButton = screen.getByText('Random (Characters)')
		expect(charButton.className).toContain('bg-slate-600')
		const wordButton = screen.getByText('Easy to Remember (Words)')
		expect(wordButton.className).toContain('bg-slate-900')
	})

	it('highlights passphrase mode when active', () => {
		render(<ModeSelector mode='passphrase' setMode={vi.fn()} />)
		const wordButton = screen.getByText('Easy to Remember (Words)')
		expect(wordButton.className).toContain('bg-slate-600')
		const charButton = screen.getByText('Random (Characters)')
		expect(charButton.className).toContain('bg-slate-900')
	})

	it('calls setMode with characters when clicking characters button', () => {
		const setMode = vi.fn()
		render(<ModeSelector mode='passphrase' setMode={setMode} />)
		fireEvent.click(screen.getByText('Random (Characters)'))
		expect(setMode).toHaveBeenCalledWith('characters')
	})

	it('calls setMode with passphrase when clicking passphrase button', () => {
		const setMode = vi.fn()
		render(<ModeSelector mode='characters' setMode={setMode} />)
		fireEvent.click(screen.getByText('Easy to Remember (Words)'))
		expect(setMode).toHaveBeenCalledWith('passphrase')
	})
})
