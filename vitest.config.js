import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		setupFiles: ['./src/__tests__/setup.js'],
		globals: true,
		include: ['src/__tests__/**/*.test.{js,jsx}'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'lcov'],
			include: ['src/**/*.{js,jsx}'],
			exclude: ['src/**/*.astro', 'src/__tests__/**', 'src/env.d.ts']
		}
	}
})
