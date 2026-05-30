import { describe, it, expect } from 'vitest'
import {
	getDictionary,
	getBrowserLanguage,
	LANGUAGES,
	DICTIONARY_SIZE
} from '../services/dictionaries'

describe('dictionaries', () => {
	it('exports DICTIONARY_SIZE as 2048', () => {
		expect(DICTIONARY_SIZE).toBe(2048)
	})

	it('exports LANGUAGES with 3 entries', () => {
		expect(LANGUAGES).toHaveLength(3)
		expect(LANGUAGES.map((l) => l.code)).toEqual(['en', 'es', 'gl'])
	})

	it('LANGUAGES have native labels', () => {
		expect(LANGUAGES.find((l) => l.code === 'en').label).toBe('English')
		expect(LANGUAGES.find((l) => l.code === 'es').label).toBe('Español')
		expect(LANGUAGES.find((l) => l.code === 'gl').label).toBe('Galego')
	})

	it('getDictionary returns English dictionary by default', () => {
		const dict = getDictionary('en')
		expect(dict).toHaveLength(2048)
	})

	it('getDictionary returns Spanish dictionary', () => {
		const dict = getDictionary('es')
		expect(dict).toHaveLength(2048)
	})

	it('getDictionary returns Galician dictionary', () => {
		const dict = getDictionary('gl')
		expect(dict).toHaveLength(2048)
	})

	it('getDictionary falls back to English for unknown language', () => {
		const dict = getDictionary('fr')
		expect(dict).toBe(getDictionary('en'))
	})

	it('getBrowserLanguage returns a supported language', () => {
		const lang = getBrowserLanguage()
		expect(['en', 'es', 'gl']).toContain(lang)
	})

	it('getBrowserLanguage returns en for unsupported browser language', () => {
		const original = navigator.language
		Object.defineProperty(navigator, 'language', { value: 'fr-FR', configurable: true })
		expect(getBrowserLanguage()).toBe('en')
		Object.defineProperty(navigator, 'language', { value: original, configurable: true })
	})

	it('getBrowserLanguage handles language without region', () => {
		const original = navigator.language
		Object.defineProperty(navigator, 'language', { value: 'es', configurable: true })
		expect(getBrowserLanguage()).toBe('es')
		Object.defineProperty(navigator, 'language', { value: original, configurable: true })
	})

	it('getBrowserLanguage falls back to en when navigator.language is undefined', () => {
		const original = navigator.language
		Object.defineProperty(navigator, 'language', { value: undefined, configurable: true })
		expect(getBrowserLanguage()).toBe('en')
		Object.defineProperty(navigator, 'language', { value: original, configurable: true })
	})

	it('all dictionary words are 4-8 characters', () => {
		for (const lang of ['en', 'es', 'gl']) {
			const dict = getDictionary(lang)
			for (const word of dict) {
				expect(word.length).toBeGreaterThanOrEqual(4)
				expect(word.length).toBeLessThanOrEqual(8)
			}
		}
	})

	it('all dictionary words are lowercase', () => {
		for (const lang of ['en', 'es', 'gl']) {
			const dict = getDictionary(lang)
			for (const word of dict) {
				expect(word).toBe(word.toLowerCase())
			}
		}
	})
})
