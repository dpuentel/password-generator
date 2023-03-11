import { useState, useEffect } from 'react'
import {
	PatternSymbols,
	PatternNumbers,
	PatternUppercase,
	PatternLowerCase
} from '../services/Patterns'

export function useGeneratePasword () {
	const [password, setPassword] = useState('')
	const [length, setLength] = useState(10)
	const [includeUppercase, setIncludeUppercase] = useState(false)
	const [includeNumbers, setIncludeNumbers] = useState(false)
	const [includeSymbols, setIncludeSymbols] = useState(false)

	useEffect(() => {
		generatePassword()
	}, [includeUppercase, includeNumbers, includeSymbols, length])

	const generatePassword = () => {
		const charactersByPattern = Math.floor(length / getPatternsNumberActive())
		const activePatterns = getActivePatterns()
		let lastUsedPattern = null
		let password = ''

		activePatterns.forEach((pattern) => {
			[...Array(charactersByPattern)].forEach(() => {
				password += getCharacterForPattern(pattern)
				lastUsedPattern = pattern
			})
		})

		while (password.length < length) {
			password += getCharacterForPattern(lastUsedPattern)
		}

		password = shuffle([...password]).join('')

		setPassword(password)
	}

	const getPatternsNumberActive = () => {
		return (
			[includeNumbers, includeSymbols, includeUppercase].filter(Boolean)
				.length + 1
		)
	}

	const getActivePatterns = () => {
		const activePatterns = []
		activePatterns.push(new RegExp(`[${PatternLowerCase}]`))
		if (includeUppercase) {
			activePatterns.push(new RegExp(`[${PatternUppercase}]`))
		}
		if (includeNumbers) activePatterns.push(new RegExp(`[${PatternNumbers}]`))
		if (includeSymbols) activePatterns.push(new RegExp(`[${PatternSymbols}]`))
		return activePatterns
	}

	const getCharacterForPattern = (pattern) => {
		let result
		while (true) {
			result = String.fromCharCode(getRandom())
			if (pattern.test(result)) {
				return result
			}
		}
	}

	const shuffle = (array) => {
		return array.sort(() => getRandom() - 128)
	}

	const getRandom = () => {
		const result = new Uint8Array(1)
		window.crypto.getRandomValues(result)
		return result[0]
	}

	return {
		password,
		length,
		includeUppercase,
		includeNumbers,
		includeSymbols,
		setLength,
		setIncludeUppercase,
		setIncludeNumbers,
		setIncludeSymbols,
		generatePassword
	}
}
