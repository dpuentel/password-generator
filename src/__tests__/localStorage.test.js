import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loadSettings, saveSettings } from '../services/localStorage'

describe('localStorage', () => {
	beforeEach(() => {
		localStorage.clear()
	})

	it('returns null when no settings are saved', () => {
		expect(loadSettings()).toBeNull()
	})

	it('returns saved settings after saveSettings', () => {
		const settings = { mode: 'passphrase', wordCount: 5 }
		saveSettings(settings)
		expect(loadSettings()).toEqual(settings)
	})

	it('overwrites previous settings', () => {
		saveSettings({ mode: 'characters' })
		saveSettings({ mode: 'passphrase' })
		expect(loadSettings()).toEqual({ mode: 'passphrase' })
	})

	it('returns null when localStorage contains invalid JSON', () => {
		localStorage.setItem('password-generator-settings', 'not-json')
		expect(loadSettings()).toBeNull()
	})

	it('handles saveSettings when localStorage throws', () => {
		const original = localStorage.setItem
		localStorage.setItem = vi.fn(() => { throw new Error('full') })
		expect(() => saveSettings({ mode: 'characters' })).not.toThrow()
		localStorage.setItem = original
	})

	it('handles loadSettings when localStorage throws', () => {
		const original = localStorage.getItem
		localStorage.getItem = vi.fn(() => { throw new Error('error') })
		expect(loadSettings()).toBeNull()
		localStorage.getItem = original
	})
})
