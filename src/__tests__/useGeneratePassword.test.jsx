import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGeneratePassword } from '../hooks/useGeneratePassword'

describe('useGeneratePassword', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
	})

	it('generates a password on mount', () => {
		const { result } = renderHook(() => useGeneratePassword())
		expect(result.current.password.length).toBe(10)
	})

	it('generates password with correct length', () => {
		const { result } = renderHook(() => useGeneratePassword())
		expect(result.current.password.length).toBe(10)
	})

	it('generates password with custom length', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setLength(16)
		})
		expect(result.current.password.length).toBe(16)
	})

	it('initializes with lowercase enabled', () => {
		const { result } = renderHook(() => useGeneratePassword())
		expect(result.current.includeLowercase).toBe(true)
	})

	it('initializes with other toggles disabled', () => {
		const { result } = renderHook(() => useGeneratePassword())
		expect(result.current.includeUppercase).toBe(false)
		expect(result.current.includeNumbers).toBe(false)
		expect(result.current.includeSymbols).toBe(false)
	})

	it('generates only lowercase when no other toggles are active', () => {
		const { result } = renderHook(() => useGeneratePassword())
		expect(result.current.password).toMatch(/^[a-z]+$/)
	})

	it('cannot disable the last active charset', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeLowercase(false)
		})
		expect(result.current.includeLowercase).toBe(true)
		expect(result.current.password).not.toBe('')
	})

	it('includes lowercase when includeLowercase is true', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeUppercase(true)
		})
		expect(result.current.password).toMatch(/[a-z]/)
	})

	it('includes uppercase when includeUppercase is true', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeUppercase(true)
		})
		expect(result.current.password).toMatch(/[A-Z]/)
	})

	it('includes numbers when includeNumbers is true', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeNumbers(true)
		})
		expect(result.current.password).toMatch(/[0-9]/)
	})

	it('includes symbols when includeSymbols is true', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeSymbols(true)
		})
		expect(result.current.password).toMatch(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/)
	})

	it('generates password with all character types enabled', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeUppercase(true)
			result.current.setIncludeNumbers(true)
			result.current.setIncludeSymbols(true)
		})
		const password = result.current.password
		expect(password.length).toBe(10)
	})

	it('regenerates password when length changes', () => {
		const { result } = renderHook(() => useGeneratePassword())
		const firstPassword = result.current.password
		act(() => {
			result.current.setLength(12)
		})
		expect(result.current.password).not.toBe(firstPassword)
		expect(result.current.password.length).toBe(12)
	})

	it('regenerates password when toggles change', () => {
		const { result } = renderHook(() => useGeneratePassword())
		const firstPassword = result.current.password
		act(() => {
			result.current.setIncludeUppercase(true)
		})
		expect(result.current.password).not.toBe(firstPassword)
	})

	it('generatePassword function produces new password', () => {
		const { result } = renderHook(() => useGeneratePassword())
		const firstPassword = result.current.password
		act(() => {
			result.current.generatePassword()
		})
		expect(result.current.password).not.toBe(firstPassword)
	})

	it('setLength updates length state', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setLength(20)
		})
		expect(result.current.length).toBe(20)
	})

	it('clamps length to minimum of 4', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setLength(1)
		})
		expect(result.current.length).toBe(4)
	})

	it('clamps length to maximum of 64', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setLength(100)
		})
		expect(result.current.length).toBe(64)
	})

	it('clamps length when value is NaN', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setLength(NaN)
		})
		expect(result.current.length).toBe(4)
	})

	it('setIncludeUppercase updates state', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeUppercase(true)
		})
		expect(result.current.includeUppercase).toBe(true)
	})

	it('setIncludeLowercase updates state when another charset is active', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeUppercase(true)
		})
		act(() => {
			result.current.setIncludeLowercase(false)
		})
		expect(result.current.includeLowercase).toBe(false)
	})

	it('setIncludeLowercase is blocked when it is the only active charset', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeLowercase(false)
		})
		expect(result.current.includeLowercase).toBe(true)
	})

	it('setIncludeNumbers updates state', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeNumbers(true)
		})
		expect(result.current.includeNumbers).toBe(true)
	})

	it('setIncludeSymbols updates state', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeSymbols(true)
		})
		expect(result.current.includeSymbols).toBe(true)
	})

	it('excludeAmbiguous is false by default', () => {
		const { result } = renderHook(() => useGeneratePassword())
		expect(result.current.excludeAmbiguous).toBe(false)
	})

	it('setExcludeAmbiguous updates state', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setExcludeAmbiguous(true)
		})
		expect(result.current.excludeAmbiguous).toBe(true)
	})

	it('excludes ambiguous characters when enabled with lowercase', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setExcludeAmbiguous(true)
			result.current.setLength(64)
		})
		expect(result.current.password).not.toMatch(/[ilo]/)
	})

	it('excludes ambiguous characters when enabled with uppercase', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeUppercase(true)
			result.current.setExcludeAmbiguous(true)
			result.current.setLength(64)
		})
		expect(result.current.password).not.toMatch(/[ILO]/)
	})

	it('excludes ambiguous digits when enabled with numbers', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeNumbers(true)
			result.current.setExcludeAmbiguous(true)
			result.current.setLength(64)
		})
		expect(result.current.password).not.toMatch(/[01]/)
	})

	it('includes ambiguous characters when disabled', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeUppercase(true)
			result.current.setIncludeNumbers(true)
			result.current.setExcludeAmbiguous(false)
			result.current.setLength(64)
		})
		const password = result.current.password
		const hasAmbiguous = /[ILO01]/.test(password)
		expect(hasAmbiguous).toBe(true)
	})

	it('can disable lowercase when numbers are also active', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeNumbers(true)
		})
		act(() => {
			result.current.setIncludeLowercase(false)
		})
		expect(result.current.includeLowercase).toBe(false)
		expect(result.current.password).toMatch(/^[0-9]+$/)
	})

	it('can disable lowercase when symbols are also active', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeSymbols(true)
		})
		act(() => {
			result.current.setIncludeLowercase(false)
		})
		expect(result.current.includeLowercase).toBe(false)
		expect(result.current.password).not.toMatch(/[a-z]/)
	})

	it('excludes ambiguous symbols when enabled with symbols', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeSymbols(true)
			result.current.setExcludeAmbiguous(true)
			result.current.setLength(64)
		})
		expect(result.current.password).not.toMatch(/[ilo]/)
	})

	it('excludes ambiguous from all charsets when all enabled', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeUppercase(true)
			result.current.setIncludeNumbers(true)
			result.current.setIncludeSymbols(true)
			result.current.setExcludeAmbiguous(true)
			result.current.setLength(64)
		})
		const password = result.current.password
		expect(password).not.toMatch(/[iloILO01]/)
	})

	it('getActiveCharsetCount works with lowercase disabled', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeUppercase(true)
			result.current.setIncludeNumbers(true)
		})
		act(() => {
			result.current.setIncludeLowercase(false)
		})
		act(() => {
			result.current.setIncludeNumbers(false)
		})
		expect(result.current.includeLowercase).toBe(false)
		expect(result.current.includeNumbers).toBe(false)
		expect(result.current.includeUppercase).toBe(true)
	})

	it('excludes ambiguous with lowercase disabled', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeUppercase(true)
			result.current.setIncludeNumbers(true)
		})
		act(() => {
			result.current.setIncludeLowercase(false)
		})
		act(() => {
			result.current.setExcludeAmbiguous(true)
			result.current.setLength(64)
		})
		const password = result.current.password
		expect(password).not.toMatch(/[a-z]/)
		expect(password).not.toMatch(/[ILO01]/)
	})

	it('defaults to characters mode', () => {
		const { result } = renderHook(() => useGeneratePassword())
		expect(result.current.mode).toBe('characters')
	})

	it('switches to passphrase mode', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setMode('passphrase')
		})
		expect(result.current.mode).toBe('passphrase')
	})

	it('generates passphrase with correct word count', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setMode('passphrase')
		})
		const words = result.current.password.split('-')
		expect(words.length).toBe(4)
	})

	it('generates passphrase with custom word count', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setMode('passphrase')
			result.current.setWordCount(6)
		})
		const words = result.current.password.split('-')
		expect(words.length).toBe(6)
	})

	it('generates passphrase with custom separator', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setMode('passphrase')
			result.current.setSeparator('.')
		})
		expect(result.current.password).toContain('.')
	})

	it('generates passphrase with space separator', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setMode('passphrase')
			result.current.setSeparator(' ')
		})
		const words = result.current.password.split(' ')
		expect(words.length).toBe(4)
	})

	it('generates passphrase with Spanish dictionary', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setMode('passphrase')
			result.current.setLanguage('es')
		})
		expect(result.current.password).not.toBe('')
	})

	it('generates passphrase with Galician dictionary', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setMode('passphrase')
			result.current.setLanguage('gl')
		})
		expect(result.current.password).not.toBe('')
	})

	it('calculates entropy for passphrase mode', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setMode('passphrase')
		})
		expect(result.current.entropy).toBeCloseTo(44)
		expect(result.current.maxEntropy).toBe(77)
	})

	it('calculates entropy for character mode', () => {
		const { result } = renderHook(() => useGeneratePassword())
		expect(result.current.entropy).toBeGreaterThan(0)
		expect(result.current.maxEntropy).toBe(426)
	})

	it('regenerates passphrase when word count changes', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setMode('passphrase')
		})
		act(() => {
			result.current.setWordCount(5)
		})
		const words = result.current.password.split('-')
		expect(words.length).toBe(5)
	})

	it('regenerates passphrase when separator changes', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setMode('passphrase')
		})
		act(() => {
			result.current.setSeparator('_')
		})
		expect(result.current.password).toContain('_')
	})

	it('regenerates passphrase when language changes', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setMode('passphrase')
		})
		act(() => {
			result.current.setLanguage('es')
		})
		expect(result.current.password).not.toBe('')
	})

	it('saves settings to localStorage', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setMode('passphrase')
			result.current.setWordCount(5)
			result.current.setSeparator('.')
		})
		const saved = JSON.parse(localStorage.getItem('password-generator-settings'))
		expect(saved.mode).toBe('passphrase')
		expect(saved.wordCount).toBe(5)
		expect(saved.separator).toBe('.')
	})

	it('loads settings from localStorage', () => {
		localStorage.setItem(
			'password-generator-settings',
			JSON.stringify({
				mode: 'passphrase',
				wordCount: 6,
				separator: '_',
				language: 'es',
				length: 10,
				includeUppercase: false,
				includeLowercase: true,
				includeNumbers: false,
				includeSymbols: false,
				excludeAmbiguous: false
			})
		)
		const { result } = renderHook(() => useGeneratePassword())
		expect(result.current.mode).toBe('passphrase')
		expect(result.current.wordCount).toBe(6)
		expect(result.current.separator).toBe('_')
		expect(result.current.language).toBe('es')
	})

	it('ignores unknown action types', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.generatePassword()
		})
		expect(result.current.password).not.toBe('')
	})

	it('cannot disable uppercase when it is the only active charset', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeUppercase(true)
			result.current.setIncludeLowercase(false)
		})
		act(() => {
			result.current.setIncludeUppercase(false)
		})
		expect(result.current.includeUppercase).toBe(true)
	})

	it('cannot disable numbers when it is the only active charset', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeNumbers(true)
			result.current.setIncludeLowercase(false)
		})
		act(() => {
			result.current.setIncludeNumbers(false)
		})
		expect(result.current.includeNumbers).toBe(true)
	})

	it('cannot disable symbols when it is the only active charset', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeSymbols(true)
			result.current.setIncludeLowercase(false)
		})
		act(() => {
			result.current.setIncludeSymbols(false)
		})
		expect(result.current.includeSymbols).toBe(true)
	})

	it('adds history entry on explicit generate', () => {
		const { result } = renderHook(() => useGeneratePassword())
		expect(result.current.history.length).toBe(0)
		act(() => {
			result.current.generatePassword()
		})
		expect(result.current.history.length).toBe(1)
		expect(result.current.history[0].password).toBe(result.current.password)
	})

	it('does not add duplicate password to history', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.generatePassword()
		})
		const firstPassword = result.current.password
		expect(result.current.history.length).toBe(1)
		act(() => {
			result.current.saveCurrentToHistory()
		})
		expect(result.current.history.length).toBe(1)
		expect(result.current.history[0].password).toBe(firstPassword)
	})

	it('adds different passwords to history', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.generatePassword()
		})
		const firstPassword = result.current.password
		act(() => {
			result.current.setLength(20)
		})
		act(() => {
			result.current.generatePassword()
		})
		expect(result.current.history.length).toBe(2)
		expect(result.current.history[0].password).not.toBe(firstPassword)
	})

	it('limits history to 4 entries', () => {
		const { result } = renderHook(() => useGeneratePassword())
		for (let i = 0; i < 10; i++) {
			act(() => {
				result.current.generatePassword()
			})
		}
		expect(result.current.history.length).toBe(4)
	})

	it('clears history', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.generatePassword()
		})
		expect(result.current.history.length).toBeGreaterThan(0)
		act(() => {
			result.current.clearHistory()
		})
		expect(result.current.history.length).toBe(0)
	})

	it('historyCollapsed defaults to true', () => {
		const { result } = renderHook(() => useGeneratePassword())
		expect(result.current.historyCollapsed).toBe(true)
	})

	it('setHistoryCollapsed updates state', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setHistoryCollapsed(false)
		})
		expect(result.current.historyCollapsed).toBe(false)
	})

	it('saves collapsed state to localStorage', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setHistoryCollapsed(false)
		})
		expect(JSON.parse(localStorage.getItem('password-generator-history-collapsed'))).toBe(false)
	})

	it('loads history from localStorage', () => {
		const entries = [{ id: '1', password: 'saved-pwd', mode: 'characters', timestamp: Date.now() }]
		localStorage.setItem('password-generator-history', JSON.stringify(entries))
		const { result } = renderHook(() => useGeneratePassword())
		expect(result.current.history).toContainEqual(entries[0])
	})

	it('loads collapsed state from localStorage', () => {
		localStorage.setItem('password-generator-history-collapsed', JSON.stringify(false))
		const { result } = renderHook(() => useGeneratePassword())
		expect(result.current.historyCollapsed).toBe(false)
	})

	it('deletes history entry', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.generatePassword()
		})
		expect(result.current.history.length).toBe(1)
		const entryId = result.current.history[0].id
		act(() => {
			result.current.deleteEntry(entryId)
		})
		expect(result.current.history.length).toBe(0)
	})

	it('renames history entry', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.generatePassword()
		})
		const entryId = result.current.history[0].id
		act(() => {
			result.current.renameEntry(entryId, 'My Password')
		})
		expect(result.current.history[0].name).toBe('My Password')
	})

	it('trims and limits rename to 30 characters', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.generatePassword()
		})
		const entryId = result.current.history[0].id
		act(() => {
			result.current.renameEntry(entryId, '  A very long password name that exceeds 30 chars  ')
		})
		expect(result.current.history[0].name).toBe('A very long password name that')
	})

	it('sets name to null for empty rename', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.generatePassword()
		})
		const entryId = result.current.history[0].id
		act(() => {
			result.current.renameEntry(entryId, '   ')
		})
		expect(result.current.history[0].name).toBeNull()
	})

	it('clears only unnamed history', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.generatePassword()
		})
		act(() => {
			result.current.renameEntry(result.current.history[0].id, 'Named')
		})
		act(() => {
			result.current.setLength(20)
		})
		act(() => {
			result.current.generatePassword()
		})
		expect(result.current.history.length).toBe(2)
		act(() => {
			result.current.clearUnnamedHistory()
		})
		expect(result.current.history.length).toBe(1)
		expect(result.current.history[0].name).toBe('Named')
	})

	it('preserves named entries when adding unnamed entries beyond limit', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.generatePassword()
		})
		act(() => {
			result.current.renameEntry(result.current.history[0].id, 'Preserved')
		})
		for (let i = 0; i < 10; i++) {
			act(() => {
				result.current.setLength(4 + i)
			})
			act(() => {
				result.current.generatePassword()
			})
		}
		const namedEntries = result.current.history.filter((e) => e.name)
		expect(namedEntries.length).toBe(1)
		expect(namedEntries[0].name).toBe('Preserved')
		const unnamedEntries = result.current.history.filter((e) => !e.name)
		expect(unnamedEntries.length).toBeLessThanOrEqual(4)
	})

	it('renames existing entry when saving as named', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.generatePassword()
		})
		expect(result.current.history.length).toBe(1)
		expect(result.current.history[0].name).toBeFalsy()
		act(() => {
			result.current.saveNamedToHistory('My Bank')
		})
		expect(result.current.history.length).toBe(1)
		expect(result.current.history[0].name).toBe('My Bank')
	})

	it('creates new named entry when password not in history', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.saveNamedToHistory('Saved')
		})
		expect(result.current.history.length).toBe(1)
		expect(result.current.history[0].name).toBe('Saved')
		expect(result.current.history[0].password).toBe(result.current.password)
	})

	it('clearLastSavedId resets lastSavedId to null', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.saveNamedToHistory('Test')
		})
		expect(result.current.lastSavedId).toBeTruthy()
		act(() => {
			result.current.clearLastSavedId()
		})
		expect(result.current.lastSavedId).toBeNull()
	})

	it('renames entry with trimmed and sliced name', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.generatePassword()
		})
		const entryId = result.current.history[0].id
		act(() => {
			result.current.renameEntry(entryId, '  A very long name that exceeds limit  ')
		})
		expect(result.current.history[0].name).toBe('A very long name that exceeds ')
	})

	it('trims and slices name to 30 characters', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.generatePassword()
		})
		act(() => {
			result.current.saveNamedToHistory('Test')
		})
		const entryId = result.current.history[0].id
		act(() => {
			result.current.renameEntry(entryId, '  trimmed  ')
		})
		expect(result.current.history[0].name).toBe('trimmed')
	})

	it('sets name to null for whitespace-only names', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.generatePassword()
		})
		act(() => {
			result.current.saveNamedToHistory('Test')
		})
		const entryId = result.current.history[0].id
		act(() => {
			result.current.renameEntry(entryId, '   ')
		})
		expect(result.current.history[0].name).toBeNull()
	})
})
