import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGeneratePassword } from '../hooks/useGeneratePassword'
import { CharsetLowercase, CharsetUppercase, CharsetNumbers, CharsetSymbols } from '../services/Patterns'

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

	it('generates only lowercase when no toggles are active', () => {
		const { result } = renderHook(() => useGeneratePassword())
		expect(result.current.password).toMatch(/^[a-z]+$/)
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

	it('setIncludeUppercase updates state', () => {
		const { result } = renderHook(() => useGeneratePassword())
		act(() => {
			result.current.setIncludeUppercase(true)
		})
		expect(result.current.includeUppercase).toBe(true)
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
})
