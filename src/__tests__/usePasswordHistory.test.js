import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePasswordHistory } from '../hooks/usePasswordHistory'

describe('usePasswordHistory', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date('2025-01-15T12:00:00Z'))
		vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
	})

	afterEach(() => {
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	const now = new Date('2025-01-15T12:00:00Z').getTime()

	const defaultProps = {
		history: [],
		historyCollapsed: true,
		setHistoryCollapsed: vi.fn(),
		clearHistory: vi.fn(),
		clearUnnamedHistory: vi.fn(),
		deleteEntry: vi.fn(),
		renameEntry: vi.fn(),
		lastSavedId: null,
		clearLastSavedId: vi.fn()
	}

	const sampleHistory = [
		{ id: '1', password: 'abc123', mode: 'characters', timestamp: now, name: null },
		{
			id: '2',
			password: 'word-word-word',
			mode: 'passphrase',
			timestamp: now - 5 * 60 * 1000,
			name: null
		},
		{
			id: '3',
			password: 'xyz789',
			mode: 'characters',
			timestamp: now - 2 * 60 * 60 * 1000,
			name: 'My Bank'
		}
	]

	const renderHistoryHook = (overrides = {}) => {
		return renderHook((props) => usePasswordHistory(props), {
			initialProps: { ...defaultProps, ...overrides }
		})
	}

	describe('toggleReveal', () => {
		it('adds id to revealedIds', () => {
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			expect(result.current.revealedIds.has('1')).toBe(false)
			act(() => result.current.toggleReveal('1'))
			expect(result.current.revealedIds.has('1')).toBe(true)
		})

		it('removes id from revealedIds on second toggle', () => {
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			act(() => result.current.toggleReveal('1'))
			expect(result.current.revealedIds.has('1')).toBe(true)
			act(() => result.current.toggleReveal('1'))
			expect(result.current.revealedIds.has('1')).toBe(false)
		})

		it('manages multiple revealed ids independently', () => {
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			act(() => result.current.toggleReveal('1'))
			act(() => result.current.toggleReveal('3'))
			expect(result.current.revealedIds.has('1')).toBe(true)
			expect(result.current.revealedIds.has('3')).toBe(true)
			expect(result.current.revealedIds.has('2')).toBe(false)
		})
	})

	describe('handleCopy', () => {
		it('calls clipboard.writeText with password', async () => {
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			await act(async () => {
				await result.current.handleCopy('1', 'abc123')
			})
			expect(navigator.clipboard.writeText).toHaveBeenCalledWith('abc123')
		})

		it('sets copiedId after successful copy', async () => {
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			expect(result.current.copiedId).toBeNull()
			await act(async () => {
				await result.current.handleCopy('1', 'abc123')
			})
			expect(result.current.copiedId).toBe('1')
		})

		it('resets copiedId after 1000ms', async () => {
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			await act(async () => {
				await result.current.handleCopy('1', 'abc123')
			})
			expect(result.current.copiedId).toBe('1')
			act(() => {
				vi.advanceTimersByTime(1000)
			})
			expect(result.current.copiedId).toBeNull()
		})

		it('silently fails when clipboard throws', async () => {
			navigator.clipboard.writeText.mockRejectedValueOnce(new Error('no permission'))
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			await act(async () => {
				await result.current.handleCopy('1', 'abc123')
			})
			expect(result.current.copiedId).toBeNull()
		})
	})

	describe('startEditing', () => {
		it('sets editingId and editValue', () => {
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			act(() => result.current.startEditing('3', 'My Bank'))
			expect(result.current.editingId).toBe('3')
			expect(result.current.editValue).toBe('My Bank')
		})

		it('sets empty string for unnamed entries', () => {
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			act(() => result.current.startEditing('1', null))
			expect(result.current.editingId).toBe('1')
			expect(result.current.editValue).toBe('')
		})
	})

	describe('saveEdit', () => {
		it('calls renameEntry with id and value', () => {
			const renameEntry = vi.fn()
			const { result } = renderHistoryHook({
				history: sampleHistory,
				historyCollapsed: false,
				renameEntry
			})
			act(() => result.current.startEditing('1', ''))
			act(() => {
				result.current.setEditValue('New Name')
			})
			act(() => result.current.saveEdit('1'))
			expect(renameEntry).toHaveBeenCalledWith('1', 'New Name')
		})

		it('clears editingId and editValue after save', () => {
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			act(() => result.current.startEditing('1', ''))
			act(() => result.current.saveEdit('1'))
			expect(result.current.editingId).toBeNull()
			expect(result.current.editValue).toBe('')
		})
	})

	describe('cancelEdit', () => {
		it('clears editingId and editValue', () => {
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			act(() => result.current.startEditing('3', 'My Bank'))
			expect(result.current.editingId).toBe('3')
			act(() => result.current.cancelEdit())
			expect(result.current.editingId).toBeNull()
			expect(result.current.editValue).toBe('')
		})
	})

	describe('handleDelete', () => {
		it('calls deleteEntry directly for unnamed entries', () => {
			const deleteEntry = vi.fn()
			const { result } = renderHistoryHook({
				history: sampleHistory,
				historyCollapsed: false,
				deleteEntry
			})
			act(() => result.current.handleDelete('1', null))
			expect(deleteEntry).toHaveBeenCalledWith('1')
			expect(result.current.deleteConfirmId).toBeNull()
		})

		it('sets deleteConfirmId for named entries', () => {
			const deleteEntry = vi.fn()
			const { result } = renderHistoryHook({
				history: sampleHistory,
				historyCollapsed: false,
				deleteEntry
			})
			act(() => result.current.handleDelete('3', 'My Bank'))
			expect(deleteEntry).not.toHaveBeenCalled()
			expect(result.current.deleteConfirmId).toBe('3')
		})
	})

	describe('confirmDelete', () => {
		it('calls deleteEntry with deleteConfirmId', () => {
			const deleteEntry = vi.fn()
			const { result } = renderHistoryHook({
				history: sampleHistory,
				historyCollapsed: false,
				deleteEntry
			})
			act(() => result.current.handleDelete('3', 'My Bank'))
			act(() => result.current.confirmDelete())
			expect(deleteEntry).toHaveBeenCalledWith('3')
		})

		it('clears deleteConfirmId after confirm', () => {
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			act(() => result.current.handleDelete('3', 'My Bank'))
			act(() => result.current.confirmDelete())
			expect(result.current.deleteConfirmId).toBeNull()
		})
	})

	describe('handleClear', () => {
		it('calls clearHistory directly when no named entries', () => {
			const clearHistory = vi.fn()
			const unnamedHistory = [
				{ id: '1', password: 'abc', mode: 'characters', timestamp: now, name: null }
			]
			const { result } = renderHistoryHook({
				history: unnamedHistory,
				historyCollapsed: false,
				clearHistory
			})
			act(() => result.current.handleClear())
			expect(clearHistory).toHaveBeenCalled()
			expect(result.current.showClearDialog).toBe(false)
		})

		it('sets showClearDialog when named entries exist', () => {
			const clearHistory = vi.fn()
			const { result } = renderHistoryHook({
				history: sampleHistory,
				historyCollapsed: false,
				clearHistory
			})
			act(() => result.current.handleClear())
			expect(clearHistory).not.toHaveBeenCalled()
			expect(result.current.showClearDialog).toBe(true)
		})
	})

	describe('closeClearDialog', () => {
		it('sets showClearDialog to false', () => {
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			act(() => result.current.handleClear())
			expect(result.current.showClearDialog).toBe(true)
			act(() => result.current.closeClearDialog())
			expect(result.current.showClearDialog).toBe(false)
		})
	})

	describe('sortedHistory', () => {
		it('sorts unnamed entries by newest first', () => {
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			const sorted = result.current.sortedHistory
			expect(sorted[0].id).toBe('1')
			expect(sorted[1].id).toBe('2')
		})

		it('sorts named entries alphabetically after unnamed', () => {
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			const sorted = result.current.sortedHistory
			expect(sorted[sorted.length - 1].id).toBe('3')
		})

		it('filters by name case insensitive', () => {
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			act(() => result.current.setSearchQuery('bank'))
			expect(result.current.sortedHistory.length).toBe(1)
			expect(result.current.sortedHistory[0].name).toBe('My Bank')
		})

		it('filters by password', () => {
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			act(() => result.current.setSearchQuery('abc123'))
			expect(result.current.sortedHistory.length).toBe(1)
			expect(result.current.sortedHistory[0].id).toBe('1')
		})

		it('returns all entries when search is empty', () => {
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			act(() => result.current.setSearchQuery('bank'))
			expect(result.current.sortedHistory.length).toBe(1)
			act(() => result.current.setSearchQuery(''))
			expect(result.current.sortedHistory.length).toBe(3)
		})

		it('returns empty array when no matches', () => {
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			act(() => result.current.setSearchQuery('nonexistent'))
			expect(result.current.sortedHistory.length).toBe(0)
		})
	})

	describe('namedCount', () => {
		it('counts entries with name', () => {
			const { result } = renderHistoryHook({ history: sampleHistory, historyCollapsed: false })
			expect(result.current.namedCount).toBe(1)
		})

		it('returns 0 when no named entries', () => {
			const unnamedHistory = [
				{ id: '1', password: 'abc', mode: 'characters', timestamp: now, name: null }
			]
			const { result } = renderHistoryHook({ history: unnamedHistory, historyCollapsed: false })
			expect(result.current.namedCount).toBe(0)
		})
	})

	describe('lastSavedId effect', () => {
		it('uncollapses history when lastSavedId is set and collapsed', () => {
			const setHistoryCollapsed = vi.fn()
			renderHistoryHook({
				history: sampleHistory,
				historyCollapsed: true,
				setHistoryCollapsed,
				lastSavedId: '1',
				clearLastSavedId: vi.fn()
			})
			expect(setHistoryCollapsed).toHaveBeenCalledWith(false)
		})

		it('clears lastSavedId after timeout', () => {
			const clearLastSavedId = vi.fn()
			renderHistoryHook({
				history: sampleHistory,
				historyCollapsed: false,
				lastSavedId: '1',
				clearLastSavedId
			})
			act(() => {
				vi.advanceTimersByTime(350)
			})
			expect(clearLastSavedId).toHaveBeenCalled()
		})
	})

	describe('handleDialogBackdropClick', () => {
		it('calls closeFn when target is currentTarget', () => {
			const { result } = renderHistoryHook()
			const closeFn = vi.fn()
			const event = { target: 'dialog', currentTarget: 'dialog' }
			result.current.handleDialogBackdropClick(event, closeFn)
			expect(closeFn).toHaveBeenCalled()
		})

		it('does not call closeFn when target differs from currentTarget', () => {
			const { result } = renderHistoryHook()
			const closeFn = vi.fn()
			const event = { target: 'button', currentTarget: 'dialog' }
			result.current.handleDialogBackdropClick(event, closeFn)
			expect(closeFn).not.toHaveBeenCalled()
		})
	})
})
