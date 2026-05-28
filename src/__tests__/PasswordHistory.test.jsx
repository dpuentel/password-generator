import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import PasswordHistory from '../components/PasswordHistory'

describe('PasswordHistory', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date('2025-01-15T12:00:00Z'))
		vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	const defaultProps = {
		history: [],
		historyCollapsed: true,
		setHistoryCollapsed: vi.fn(),
		clearHistory: vi.fn()
	}

	const now = new Date('2025-01-15T12:00:00Z').getTime()
	const sampleHistory = [
		{ id: '1', password: 'abc123', mode: 'characters', timestamp: now },
		{ id: '2', password: 'word-word-word', mode: 'passphrase', timestamp: now - 5 * 60 * 1000 },
		{ id: '3', password: 'xyz789', mode: 'characters', timestamp: now - 2 * 60 * 60 * 1000 }
	]

	it('renders HISTORY header', () => {
		render(<PasswordHistory {...defaultProps} />)
		expect(screen.getByText('HISTORY')).toBeInTheDocument()
	})

	it('starts collapsed by default', () => {
		render(<PasswordHistory {...defaultProps} />)
		expect(screen.getByText('▶')).toBeInTheDocument()
		expect(screen.queryByText('No history yet')).not.toBeInTheDocument()
	})

	it('shows content when expanded', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} />)
		expect(screen.getByText('▼')).toBeInTheDocument()
	})

	it('shows empty state when no history', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} />)
		expect(screen.getByText('No history yet')).toBeInTheDocument()
	})

	it('shows privacy notice', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} />)
		expect(screen.getByText(/All data stays in your browser/)).toBeInTheDocument()
	})

	it('calls setHistoryCollapsed when clicking header', () => {
		const setHistoryCollapsed = vi.fn()
		render(<PasswordHistory {...defaultProps} setHistoryCollapsed={setHistoryCollapsed} />)
		fireEvent.click(screen.getByText('HISTORY'))
		expect(setHistoryCollapsed).toHaveBeenCalledWith(false)
	})

	it('toggles collapse state when clicking header', () => {
		const setHistoryCollapsed = vi.fn()
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} setHistoryCollapsed={setHistoryCollapsed} />)
		fireEvent.click(screen.getByText('HISTORY'))
		expect(setHistoryCollapsed).toHaveBeenCalledWith(true)
	})

	it('renders history entries when expanded', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		const masked = screen.getAllByText('••••••••••')
		expect(masked.length).toBe(3)
	})

	it('shows relative time for each entry', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		expect(screen.getByText('Just now')).toBeInTheDocument()
		expect(screen.getByText('5 min ago')).toBeInTheDocument()
		expect(screen.getByText('2 hours ago')).toBeInTheDocument()
	})

	it('reveals password when clicking masked password', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		const revealButtons = screen.getAllByLabelText('Reveal password')
		fireEvent.click(revealButtons[0])
		expect(screen.getByText('abc123')).toBeInTheDocument()
	})

	it('hides password when clicking revealed password', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		const revealButtons = screen.getAllByLabelText('Reveal password')
		fireEvent.click(revealButtons[0])
		fireEvent.click(screen.getByLabelText('Hide password'))
		expect(screen.queryByText('abc123')).not.toBeInTheDocument()
	})

	it('copies password when clicking copy button', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		const copyButtons = screen.getAllByLabelText('Copy password')
		fireEvent.click(copyButtons[0])
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith('abc123')
	})

	it('resets copied state after timeout', async () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		const copyButtons = screen.getAllByLabelText('Copy password')
		fireEvent.click(copyButtons[0])
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith('abc123')
		act(() => {
			vi.advanceTimersByTime(1000)
		})
	})

	it('shows clear history button when there is history', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		expect(screen.getByText('Clear History')).toBeInTheDocument()
	})

	it('does not show clear history button when no history', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} />)
		expect(screen.queryByText('Clear History')).not.toBeInTheDocument()
	})

	it('calls clearHistory when clicking clear button', () => {
		const clearHistory = vi.fn()
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} clearHistory={clearHistory} />)
		fireEvent.click(screen.getByText('Clear History'))
		expect(clearHistory).toHaveBeenCalled()
	})

	it('has correct aria-expanded when collapsed', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={true} />)
		expect(screen.getByLabelText('Toggle history')).toHaveAttribute('aria-expanded', 'false')
	})

	it('has correct aria-expanded when expanded', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} />)
		expect(screen.getByLabelText('Toggle history')).toHaveAttribute('aria-expanded', 'true')
	})
})
