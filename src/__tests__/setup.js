import '@testing-library/jest-dom'
import { beforeEach, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

const originalStderrWrite = process.stderr.write.bind(process.stderr)
beforeEach(() => {
	localStorage.clear()
	process.stderr.write = (chunk, ...args) => {
		if (typeof chunk === 'string' && chunk.includes('requestSubmit')) return true
		return originalStderrWrite(chunk, ...args)
	}
})

afterEach(() => {
	cleanup()
	process.stderr.write = originalStderrWrite
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
HTMLFormElement.prototype.requestSubmit = vi.fn(function () {
	this.submit()
})
