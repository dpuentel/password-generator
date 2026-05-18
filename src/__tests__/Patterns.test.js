import { describe, it, expect } from 'vitest'
import {
	PatternSymbols,
	PatternNumbers,
	PatternUppercase,
	PatternLowerCase,
	CharsetSymbols,
	CharsetNumbers,
	CharsetUppercase,
	CharsetLowercase
} from '../services/Patterns'

describe('Patterns', () => {
	describe('Pattern constants (regex ranges)', () => {
		it('PatternSymbols contains regex range for symbols', () => {
			expect(PatternSymbols).toBe('!-/:-@[-`{-~')
		})

		it('PatternNumbers contains regex range for digits', () => {
			expect(PatternNumbers).toBe('0-9')
		})

		it('PatternUppercase contains regex range for uppercase', () => {
			expect(PatternUppercase).toBe('A-Z')
		})

		it('PatternLowerCase contains regex range for lowercase', () => {
			expect(PatternLowerCase).toBe('a-z')
		})
	})

	describe('Charset constants (expanded character sets)', () => {
		it('CharsetLowercase contains 26 lowercase letters', () => {
			expect(CharsetLowercase).toBe('abcdefghijklmnopqrstuvwxyz')
			expect(CharsetLowercase.length).toBe(26)
		})

		it('CharsetUppercase contains 26 uppercase letters', () => {
			expect(CharsetUppercase).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
			expect(CharsetUppercase.length).toBe(26)
		})

		it('CharsetNumbers contains 10 digits', () => {
			expect(CharsetNumbers).toBe('0123456789')
			expect(CharsetNumbers.length).toBe(10)
		})

		it('CharsetSymbols contains printable ASCII symbols', () => {
			expect(CharsetSymbols).toBe('!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~')
			expect(CharsetSymbols.length).toBe(32)
		})

		it('CharsetLowercase contains only a-z characters', () => {
			expect(CharsetLowercase).toMatch(/^[a-z]+$/)
		})

		it('CharsetUppercase contains only A-Z characters', () => {
			expect(CharsetUppercase).toMatch(/^[A-Z]+$/)
		})

		it('CharsetNumbers contains only 0-9 characters', () => {
			expect(CharsetNumbers).toMatch(/^[0-9]+$/)
		})
	})
})
