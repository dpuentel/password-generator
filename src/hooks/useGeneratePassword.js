import { useState, useEffect } from 'react'
import {
	PatternSymbols,
	PatternNumbers,
	PatternUppercase,
	PatternLowerCase
} from '../services/Patterns'

export function useGeneratePassword () {
	const [password, setPassword] = useState('')
	const [length, setLength] = useState(10)
	const [includeUppercase, setIncludeUppercase] = useState(false)
	const [includeNumbers, setIncludeNumbers] = useState(false)
	const [includeSymbols, setIncludeSymbols] = useState(false)

	useEffect(() => {
		generatePassword()
	}, [includeUppercase, includeNumbers, includeSymbols, length])

	const generatePassword = () => {
		const activePatterns = getActivePatterns()
		const charactersByPattern = Math.floor(length / activePatterns.length)
		let password = ''

		activePatterns.forEach((charset) => {
			for (let i = 0; i < charactersByPattern; i++) {
				password += charset[getRandomInt(charset.length)]
			}
		})

		const remainingChars = length - password.length
		const lastCharset = activePatterns[activePatterns.length - 1]
		for (let i = 0; i < remainingChars; i++) {
			password += lastCharset[getRandomInt(lastCharset.length)]
		}

		password = shuffle([...password]).join('')

		setPassword(password)
	}

	const getActivePatterns = () => {
		const charsets = [PatternLowerCase]
		if (includeUppercase) charsets.push(PatternUppercase)
		if (includeNumbers) charsets.push(PatternNumbers)
		if (includeSymbols) charsets.push(PatternSymbols)
		return charsets
	}

	const shuffle = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = getRandomInt(i + 1)
			;[array[i], array[j]] = [array[j], array[i]]
		}
		return array
	}

	const getRandomInt = (max) => {
		const result = new Uint32Array(1)
		window.crypto.getRandomValues(result)
		return result[0] % max
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
