import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PassphraseOptions from '../components/PassphraseOptions'

describe('PassphraseOptions', () => {
	const defaultProps = {
		wordCount: 4,
		setWordCount: vi.fn(),
		separator: '-',
		setSeparator: vi.fn(),
		language: 'en',
		setLanguage: vi.fn()
	}

	it('renders word count label', () => {
		render(<PassphraseOptions {...defaultProps} />)
		expect(screen.getByText('Word Count')).toBeInTheDocument()
	})

	it('renders word count value', () => {
		render(<PassphraseOptions {...defaultProps} />)
		expect(screen.getByText('4')).toBeInTheDocument()
	})

	it('renders separator label', () => {
		render(<PassphraseOptions {...defaultProps} />)
		expect(screen.getByText('Separator')).toBeInTheDocument()
	})

	it('renders all separator options', () => {
		render(<PassphraseOptions {...defaultProps} />)
		expect(screen.getByText('Dash (-)')).toBeInTheDocument()
		expect(screen.getByText('Dot (.)')).toBeInTheDocument()
		expect(screen.getByText('Underscore (_)')).toBeInTheDocument()
		expect(screen.getByText('Space ( )')).toBeInTheDocument()
	})

	it('renders language selector', () => {
		render(<PassphraseOptions {...defaultProps} />)
		expect(screen.getByLabelText('Dictionary language')).toBeInTheDocument()
	})

	it('renders all language options', () => {
		render(<PassphraseOptions {...defaultProps} />)
		const select = screen.getByLabelText('Dictionary language')
		expect(select).toContainHTML('English')
		expect(select).toContainHTML('Español')
		expect(select).toContainHTML('Galego')
	})

	it('calls setWordCount when slider changes', () => {
		const setWordCount = vi.fn()
		render(<PassphraseOptions {...defaultProps} setWordCount={setWordCount} />)
		const slider = screen.getByRole('slider')
		fireEvent.change(slider, { target: { value: '5' } })
		expect(setWordCount).toHaveBeenCalledWith(5)
	})

	it('calls setSeparator when clicking a separator button', () => {
		const setSeparator = vi.fn()
		render(<PassphraseOptions {...defaultProps} setSeparator={setSeparator} />)
		fireEvent.click(screen.getByText('Dot (.)'))
		expect(setSeparator).toHaveBeenCalledWith('.')
	})

	it('calls setLanguage when changing language select', () => {
		const setLanguage = vi.fn()
		render(<PassphraseOptions {...defaultProps} setLanguage={setLanguage} />)
		fireEvent.change(screen.getByLabelText('Dictionary language'), { target: { value: 'es' } })
		expect(setLanguage).toHaveBeenCalledWith('es')
	})

	it('highlights the active separator', () => {
		render(<PassphraseOptions {...defaultProps} separator='-' />)
		const dashButton = screen.getByText('Dash (-)')
		expect(dashButton.className).toContain('bg-slate-600')
		const dotButton = screen.getByText('Dot (.)')
		expect(dotButton.className).toContain('bg-slate-900')
	})

	it('sets correct language value in select', () => {
		render(<PassphraseOptions {...defaultProps} language='es' />)
		expect(screen.getByLabelText('Dictionary language').value).toBe('es')
	})
})
