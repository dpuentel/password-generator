import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CopyIcon, CheckIcon, SettingsIcon } from '../components/Icons'

describe('Icons', () => {
	describe('CopyIcon', () => {
		it('renders an SVG element', () => {
			render(<CopyIcon />)
			expect(screen.getByTitle('Copy')).toBeInTheDocument()
		})

		it('has the correct title', () => {
			render(<CopyIcon />)
			expect(screen.getByTitle('Copy')).toHaveTextContent('Copy')
		})
	})

	describe('CheckIcon', () => {
		it('renders an SVG element', () => {
			render(<CheckIcon />)
			expect(screen.getByTitle('Checkmark Done')).toBeInTheDocument()
		})

		it('has the correct title', () => {
			render(<CheckIcon />)
			expect(screen.getByTitle('Checkmark Done')).toHaveTextContent('Checkmark Done')
		})
	})

	describe('SettingsIcon', () => {
		it('renders an SVG element', () => {
			render(<SettingsIcon />)
			expect(screen.getByTitle('Settings')).toBeInTheDocument()
		})

		it('has the correct title', () => {
			render(<SettingsIcon />)
			expect(screen.getByTitle('Settings')).toHaveTextContent('Settings')
		})
	})
})
