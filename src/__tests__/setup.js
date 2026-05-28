import '@testing-library/jest-dom'
import { beforeEach, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

beforeEach(() => {
	localStorage.clear()
})

afterEach(() => {
	cleanup()
})

Object.defineProperty(global, 'crypto', {
	value: {
		getRandomValues: (arr) => {
			for (let i = 0; i < arr.length; i++) {
				arr[i] = Math.floor(Math.random() * 256)
			}
			return arr
		}
	}
})

Object.defineProperty(global, 'navigator', {
	value: {
		clipboard: {
			writeText: vi.fn(() => Promise.resolve())
		},
		language: 'en'
	},
	writable: true
})

/* eslint-disable no-undef */
HTMLDialogElement.prototype.showModal = vi.fn(function () {
	this.open = true
})
HTMLDialogElement.prototype.close = vi.fn(function () {
	this.open = false
})
