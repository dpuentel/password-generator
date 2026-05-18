import { describe, it, expect } from 'vitest'
import { PasswordEntropyCalculator } from '../components/PasswordEntropyCalculator'

describe('PasswordEntropyCalculator', () => {
	it('returns 0 for empty string', () => {
		expect(PasswordEntropyCalculator('')).toBe(0)
	})

	it('calculates entropy for lowercase only', () => {
		const result = PasswordEntropyCalculator('abc')
		const expected = Math.log2(26) * 3
		expect(result).toBeCloseTo(expected)
	})

	it('calculates entropy for uppercase only', () => {
		const result = PasswordEntropyCalculator('ABC')
		const expected = Math.log2(26) * 3
		expect(result).toBeCloseTo(expected)
	})

	it('calculates entropy for numbers only', () => {
		const result = PasswordEntropyCalculator('123')
		const expected = Math.log2(10) * 3
		expect(result).toBeCloseTo(expected)
	})

	it('calculates entropy for special characters only', () => {
		const result = PasswordEntropyCalculator('!@#')
		const expected = Math.log2(33) * 3
		expect(result).toBeCloseTo(expected)
	})

	it('calculates entropy for lowercase + uppercase', () => {
		const result = PasswordEntropyCalculator('aB')
		const expected = Math.log2(26 * 26) * 2
		expect(result).toBeCloseTo(expected)
	})

	it('calculates entropy for lowercase + numbers', () => {
		const result = PasswordEntropyCalculator('a1')
		const expected = Math.log2(26 * 10) * 2
		expect(result).toBeCloseTo(expected)
	})

	it('calculates entropy for uppercase + numbers', () => {
		const result = PasswordEntropyCalculator('A1')
		const expected = Math.log2(26 * 10) * 2
		expect(result).toBeCloseTo(expected)
	})

	it('calculates entropy for lowercase + uppercase + numbers', () => {
		const result = PasswordEntropyCalculator('aB1')
		const expected = Math.log2(26 * 26 * 10) * 3
		expect(result).toBeCloseTo(expected)
	})

	it('calculates entropy for all character types', () => {
		const result = PasswordEntropyCalculator('aB1!')
		const expected = Math.log2(26 * 26 * 10 * 33) * 4
		expect(result).toBeCloseTo(expected)
	})

	it('scales entropy linearly with length', () => {
		const result4 = PasswordEntropyCalculator('abcd')
		const result8 = PasswordEntropyCalculator('abcdefgh')
		expect(result8).toBeCloseTo(result4 * 2)
	})
})
