import { describe, it, expect } from 'vitest'
import {
	CharsetSymbols,
	CharsetNumbers,
	CharsetUppercase,
	CharsetLowercase,
	CharsetSymbolsNoAmbiguous,
	CharsetNumbersNoAmbiguous,
	CharsetUppercaseNoAmbiguous,
	CharsetLowercaseNoAmbiguous
} from '../services/Patterns'

describe('Patterns', () => {
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

	describe('No Ambiguous Charset constants', () => {
		it('CharsetLowercaseNoAmbiguous excludes i, l, o', () => {
			expect(CharsetLowercaseNoAmbiguous).not.toMatch(/[ilo]/)
			expect(CharsetLowercaseNoAmbiguous.length).toBe(23)
		})

		it('CharsetUppercaseNoAmbiguous excludes I, L, O', () => {
			expect(CharsetUppercaseNoAmbiguous).not.toMatch(/[ILO]/)
			expect(CharsetUppercaseNoAmbiguous.length).toBe(23)
		})

		it('CharsetNumbersNoAmbiguous excludes 0 and 1', () => {
			expect(CharsetNumbersNoAmbiguous).not.toMatch(/[01]/)
			expect(CharsetNumbersNoAmbiguous.length).toBe(8)
		})

		it('CharsetSymbolsNoAmbiguous matches regular CharsetSymbols', () => {
			expect(CharsetSymbolsNoAmbiguous).toBe(CharsetSymbols)
		})
	})
})
