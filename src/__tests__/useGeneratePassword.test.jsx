import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGeneratePassword } from '../hooks/useGeneratePassword'
import {
	CharsetLowercase,
	CharsetUppercase,
	CharsetNumbers,
	CharsetSymbols
} from '../services/Patterns'

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
})
