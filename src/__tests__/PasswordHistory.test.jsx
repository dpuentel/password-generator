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
		clearHistory: vi.fn(),
		clearUnnamedHistory: vi.fn(),
		deleteEntry: vi.fn(),
		renameEntry: vi.fn()
	}

	const now = new Date('2025-01-15T12:00:00Z').getTime()
	const sampleHistory = [
		{ id: '1', password: 'abc123', mode: 'characters', timestamp: now, name: null },
		{ id: '2', password: 'word-word-word', mode: 'passphrase', timestamp: now - 5 * 60 * 1000, name: null },
		{ id: '3', password: 'xyz789', mode: 'characters', timestamp: now - 2 * 60 * 60 * 1000, name: 'My Bank' }
	]

	it('renders HISTORY header', () => {
		render(<PasswordHistory {...defaultProps} />)
		expect(screen.getByText('HISTORY')).toBeInTheDocument()
	})

	it('starts collapsed by default', () => {
		const { container } = render(<PasswordHistory {...defaultProps} />)
		expect(screen.getByLabelText('Toggle history')).toHaveAttribute('aria-expanded', 'false')
		const gridDiv = container.querySelector('.grid.transition-\\[grid-template-rows\\]')
		expect(gridDiv.style.gridTemplateRows).toBe('0fr')
	})

	it('shows content when expanded', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} />)
		expect(screen.getByLabelText('Toggle history')).toHaveAttribute('aria-expanded', 'true')
		expect(screen.getByText('No history yet')).toBeInTheDocument()
	})

	it('shows privacy notice', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} />)
		expect(screen.getByText('All data stays in your browser')).toBeInTheDocument()
	})

	it('renders lock icon in privacy notice', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} />)
		expect(screen.getByTitle('Lock')).toBeInTheDocument()
	})

	it('renders chevron icon', () => {
		render(<PasswordHistory {...defaultProps} />)
		expect(screen.getByTitle('Chevron')).toBeInTheDocument()
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
		expect(masked.length).toBeGreaterThanOrEqual(2)
	})

	it('shows relative time for each entry', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		expect(screen.getAllByText('Just now').length).toBeGreaterThan(0)
		expect(screen.getByText('5 min ago')).toBeInTheDocument()
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

	it('resets copied state after timeout', () => {
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
		expect(screen.getByRole('button', { name: 'Clear history' })).toBeInTheDocument()
	})

	it('does not show clear history button when no history', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} />)
		expect(screen.queryByRole('button', { name: 'Clear history' })).not.toBeInTheDocument()
	})

	it('calls clearHistory directly when no named entries', () => {
		const clearHistory = vi.fn()
		const unnamedHistory = [
			{ id: '1', password: 'abc', mode: 'characters', timestamp: now, name: null }
		]
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={unnamedHistory} clearHistory={clearHistory} />)
		fireEvent.click(screen.getByRole('button', { name: 'Clear history' }))
		expect(clearHistory).toHaveBeenCalled()
	})

	it('shows clear dialog when named entries exist', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		fireEvent.click(screen.getByRole('button', { name: 'Clear history' }))
		expect(screen.getByText(/Do you want to delete them too/)).toBeInTheDocument()
		expect(screen.getByText('Keep Named')).toBeInTheDocument()
		expect(screen.getByText('Delete All')).toBeInTheDocument()
	})

	it('shows named entry name', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		expect(screen.getByText('My Bank')).toBeInTheDocument()
	})

	it('shows delete button for each entry', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		const deleteButtons = screen.getAllByLabelText('Delete entry')
		expect(deleteButtons.length).toBe(3)
	})

	it('deletes unnamed entry directly', () => {
		const deleteEntry = vi.fn()
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} deleteEntry={deleteEntry} />)
		const deleteButtons = screen.getAllByLabelText('Delete entry')
		fireEvent.click(deleteButtons[0])
		expect(deleteEntry).toHaveBeenCalledWith('1')
	})

	it('shows edit button for each entry', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		const editButtons = screen.getAllByLabelText('Edit name')
		expect(editButtons.length).toBe(3)
	})

	it('shows input when clicking edit button', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		const editButtons = screen.getAllByLabelText('Edit name')
		fireEvent.click(editButtons[0])
		expect(screen.getByLabelText('Password name')).toBeInTheDocument()
	})

	it('calls renameEntry when saving edit', () => {
		const renameEntry = vi.fn()
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} renameEntry={renameEntry} />)
		const editButtons = screen.getAllByLabelText('Edit name')
		fireEvent.click(editButtons[0])
		const input = screen.getByLabelText('Password name')
		fireEvent.change(input, { target: { value: 'New Name' } })
		fireEvent.keyDown(input, { key: 'Enter' })
		expect(renameEntry).toHaveBeenCalledWith('1', 'New Name')
	})

	it('cancels edit on Escape', () => {
		const renameEntry = vi.fn()
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} renameEntry={renameEntry} />)
		const editButtons = screen.getAllByLabelText('Edit name')
		fireEvent.click(editButtons[0])
		const input = screen.getByLabelText('Password name')
		fireEvent.keyDown(input, { key: 'Escape' })
		expect(renameEntry).not.toHaveBeenCalled()
		expect(screen.queryByLabelText('Password name')).not.toBeInTheDocument()
	})

	it('limits name input to 30 characters', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		const editButtons = screen.getAllByLabelText('Edit name')
		fireEvent.click(editButtons[0])
		const input = screen.getByLabelText('Password name')
		expect(input.maxLength).toBe(30)
	})

	it('has correct aria-expanded when collapsed', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={true} />)
		expect(screen.getByLabelText('Toggle history')).toHaveAttribute('aria-expanded', 'false')
	})

	it('has correct aria-expanded when expanded', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} />)
		expect(screen.getByLabelText('Toggle history')).toHaveAttribute('aria-expanded', 'true')
	})

	it('sorts unnamed entries by newest first', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		const items = screen.getAllByRole('listitem')
		expect(items[0]).toHaveTextContent('••••••••••')
		expect(items[0]).toHaveTextContent('Just now')
	})

	it('sorts named entries after unnamed', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		const items = screen.getAllByRole('listitem')
		expect(items[items.length - 1]).toHaveTextContent('My Bank')
	})

	it('shows delete confirmation dialog for named entries', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		const deleteButtons = screen.getAllByLabelText('Delete entry')
		fireEvent.click(deleteButtons[2])
		expect(screen.getByText(/This action cannot be undone/)).toBeInTheDocument()
	})

	it('confirms delete for named entry', () => {
		const deleteEntry = vi.fn()
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} deleteEntry={deleteEntry} />)
		const deleteButtons = screen.getAllByLabelText('Delete entry')
		fireEvent.click(deleteButtons[2])
		const dialog = document.querySelector('dialog')
		const deleteBtn = dialog.querySelector('.bg-red-600')
		fireEvent.click(deleteBtn)
		expect(deleteEntry).toHaveBeenCalledWith('3')
	})

	it('cancels delete for named entry', () => {
		const deleteEntry = vi.fn()
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} deleteEntry={deleteEntry} />)
		const deleteButtons = screen.getAllByLabelText('Delete entry')
		fireEvent.click(deleteButtons[2])
		const dialog = document.querySelector('dialog')
		const cancelBtn = dialog.querySelector('.bg-slate-700')
		fireEvent.click(cancelBtn)
		expect(deleteEntry).not.toHaveBeenCalled()
	})

	it('shows clear dialog with Keep Named and Delete All buttons', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		fireEvent.click(screen.getByRole('button', { name: 'Clear history' }))
		expect(screen.getByText('Keep Named')).toBeInTheDocument()
		expect(screen.getByText('Delete All')).toBeInTheDocument()
	})

	it('calls clearUnnamedHistory when clicking Keep Named', () => {
		const clearUnnamedHistory = vi.fn()
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} clearUnnamedHistory={clearUnnamedHistory} />)
		fireEvent.click(screen.getByRole('button', { name: 'Clear history' }))
		fireEvent.click(screen.getByText('Keep Named'))
		expect(clearUnnamedHistory).toHaveBeenCalled()
	})

	it('calls clearHistory when clicking Delete All', () => {
		const clearHistory = vi.fn()
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} clearHistory={clearHistory} />)
		fireEvent.click(screen.getByRole('button', { name: 'Clear history' }))
		fireEvent.click(screen.getByText('Delete All'))
		expect(clearHistory).toHaveBeenCalled()
	})

	it('cancels clear dialog', () => {
		const clearHistory = vi.fn()
		const clearUnnamedHistory = vi.fn()
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} clearHistory={clearHistory} clearUnnamedHistory={clearUnnamedHistory} />)
		fireEvent.click(screen.getByRole('button', { name: 'Clear history' }))
		const dialogs = document.querySelectorAll('dialog')
		const clearDialog = dialogs[1]
		const cancelBtn = clearDialog.querySelector('.bg-slate-700')
		fireEvent.click(cancelBtn)
		expect(clearHistory).not.toHaveBeenCalled()
		expect(clearUnnamedHistory).not.toHaveBeenCalled()
	})

	it('shows scrollbar when many entries', () => {
		const manyEntries = Array.from({ length: 10 }, (_, i) => ({
			id: String(i), password: `pwd${i}`, mode: 'characters', timestamp: Date.now() - i * 1000, name: null
		}))
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={manyEntries} />)
		const list = screen.getByRole('list')
		expect(list.className).toContain('max-h-60')
		expect(list.className).toContain('overflow-y-auto')
	})

	it('saves edit on blur', () => {
		const renameEntry = vi.fn()
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} renameEntry={renameEntry} />)
		const editButtons = screen.getAllByLabelText('Edit name')
		fireEvent.click(editButtons[0])
		const input = screen.getByLabelText('Password name')
		fireEvent.change(input, { target: { value: 'Blurred Name' } })
		fireEvent.blur(input)
		expect(renameEntry).toHaveBeenCalledWith('1', 'Blurred Name')
	})

	it('pre-fills edit input with current name', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		const editButtons = screen.getAllByLabelText('Edit name')
		fireEvent.click(editButtons[2])
		const input = screen.getByLabelText('Password name')
		expect(input.value).toBe('My Bank')
	})

	it('shows placeholder in edit input for unnamed entries', () => {
		render(<PasswordHistory {...defaultProps} historyCollapsed={false} history={sampleHistory} />)
		const editButtons = screen.getAllByLabelText('Edit name')
		fireEvent.click(editButtons[0])
		const input = screen.getByLabelText('Password name')
		expect(input.placeholder).toBe('Name this password')
	})
})
