import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
	loadHistory,
	saveHistory,
	addEntry,
	clearHistory,
	loadCollapsed,
	saveCollapsed
} from '../services/sessionStorage'

describe('sessionStorage', () => {
	beforeEach(() => {
		localStorage.clear()
	})

	describe('loadHistory', () => {
		it('returns empty array when no history is saved', () => {
			expect(loadHistory()).toEqual([])
		})

		it('returns decoded history', () => {
			const entries = [{ id: '1', password: 'abc', mode: 'characters', timestamp: Date.now() }]
			saveHistory(entries)
			expect(loadHistory()).toEqual(entries)
		})

		it('decodes base64 encoded passwords', () => {
			const encoded = [
				{
					id: '1',
					password: btoa(encodeURIComponent('abc')),
					mode: 'characters',
					timestamp: Date.now()
				}
			]
			localStorage.setItem('password-generator-history', JSON.stringify(encoded))
			expect(loadHistory()[0].password).toBe('abc')
		})

		it('returns empty array when localStorage contains invalid JSON', () => {
			localStorage.setItem('password-generator-history', 'not-json')
			expect(loadHistory()).toEqual([])
		})

		it('returns empty array when localStorage throws', () => {
			const original = localStorage.getItem
			localStorage.getItem = vi.fn(() => {
				throw new Error('error')
			})
			expect(loadHistory()).toEqual([])
			localStorage.getItem = original
		})
	})

	describe('saveHistory', () => {
		it('saves encoded entries to localStorage', () => {
			const entries = [{ id: '1', password: 'abc', mode: 'characters', timestamp: Date.now() }]
			saveHistory(entries)
			const raw = JSON.parse(localStorage.getItem('password-generator-history'))
			expect(raw[0].password).toBe(btoa(encodeURIComponent('abc')))
		})

		it('roundtrips through save and load', () => {
			const entries = [
				{ id: '1', password: 'abc', mode: 'characters', timestamp: 1000 },
				{ id: '2', password: 'word-word', mode: 'passphrase', timestamp: 2000 }
			]
			saveHistory(entries)
			expect(loadHistory()).toEqual(entries)
		})

		it('handles save when localStorage throws', () => {
			const original = localStorage.setItem
			localStorage.setItem = vi.fn(() => {
				throw new Error('full')
			})
			expect(() => saveHistory([])).not.toThrow()
			localStorage.setItem = original
		})

		it('handles encode error gracefully', () => {
			const originalBtoa = global.btoa
			global.btoa = vi.fn(() => {
				throw new Error('btoa error')
			})
			const entries = [{ id: '1', password: 'abc', mode: 'characters', timestamp: Date.now() }]
			expect(() => saveHistory(entries)).not.toThrow()
			global.btoa = originalBtoa
		})
	})

	describe('addEntry', () => {
		it('prepends new entry to empty history', () => {
			const entry = { id: '1', password: 'abc', mode: 'characters', timestamp: Date.now() }
			const result = addEntry([], entry)
			expect(result).toEqual([entry])
		})

		it('prepends new entry to existing history', () => {
			const existing = { id: '1', password: 'abc', mode: 'characters', timestamp: 1000 }
			const entry = { id: '2', password: 'def', mode: 'passphrase', timestamp: 2000 }
			const result = addEntry([existing], entry)
			expect(result).toEqual([entry, existing])
		})

		it('limits history to 4 entries', () => {
			const entries = Array.from({ length: 4 }, (_, i) => ({
				id: String(i),
				password: `pwd${i}`,
				mode: 'characters',
				timestamp: i
			}))
			const entry = { id: '4', password: 'new', mode: 'characters', timestamp: 4 }
			const result = addEntry(entries, entry)
			expect(result).toHaveLength(4)
			expect(result[0]).toEqual(entry)
			expect(result[3]).toEqual(entries[2])
		})
	})

	describe('clearHistory', () => {
		it('removes history from localStorage', () => {
			saveHistory([{ id: '1', password: 'abc', mode: 'characters', timestamp: Date.now() }])
			clearHistory()
			expect(localStorage.getItem('password-generator-history')).toBeNull()
		})

		it('handles clear when localStorage throws', () => {
			const original = localStorage.removeItem
			localStorage.removeItem = vi.fn(() => {
				throw new Error('error')
			})
			expect(() => clearHistory()).not.toThrow()
			localStorage.removeItem = original
		})
	})

	describe('loadCollapsed', () => {
		it('returns true by default', () => {
			expect(loadCollapsed()).toBe(true)
		})

		it('returns saved value', () => {
			localStorage.setItem('password-generator-history-collapsed', JSON.stringify(false))
			expect(loadCollapsed()).toBe(false)
		})

		it('returns true when localStorage contains invalid JSON', () => {
			localStorage.setItem('password-generator-history-collapsed', 'not-json')
			expect(loadCollapsed()).toBe(true)
		})

		it('returns true when localStorage throws', () => {
			const original = localStorage.getItem
			localStorage.getItem = vi.fn(() => {
				throw new Error('error')
			})
			expect(loadCollapsed()).toBe(true)
			localStorage.getItem = original
		})
	})

	describe('saveCollapsed', () => {
		it('saves collapsed state to localStorage', () => {
			saveCollapsed(false)
			expect(JSON.parse(localStorage.getItem('password-generator-history-collapsed'))).toBe(false)
		})

		it('handles save when localStorage throws', () => {
			const original = localStorage.setItem
			localStorage.setItem = vi.fn(() => {
				throw new Error('full')
			})
			expect(() => saveCollapsed(true)).not.toThrow()
			localStorage.setItem = original
		})
	})
})
