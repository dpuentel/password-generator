import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

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
		}
	},
	writable: true
})
