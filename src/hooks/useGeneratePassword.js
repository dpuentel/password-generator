import { useState, useEffect } from 'react'
import {
	CharsetSymbols,
	CharsetNumbers,
	CharsetUppercase,
	CharsetLowercase
} from '../services/Patterns'

const MIN_LENGTH = 4
const MAX_LENGTH = 64

export function useGeneratePassword() {
	const [password, setPassword] = useState('')
	const [length, setLength] = useState(10)
	const [includeUppercase, setIncludeUppercase] = useState(false)
	const [includeLowercase, setIncludeLowercase] = useState(true)
	const [includeNumbers, setIncludeNumbers] = useState(false)
	const [includeSymbols, setIncludeSymbols] = useState(false)

	useEffect(() => {
		generatePassword()
	}, [includeUppercase, includeLowercase, includeNumbers, includeSymbols, length])

	const clampLength = (value) => {
		const num = Number(value)
		if (isNaN(num)) return MIN_LENGTH
		return Math.min(MAX_LENGTH, Math.max(MIN_LENGTH, num))
	}

	const setLengthClamped = (value) => {
		setLength(clampLength(value))
	}

	const generatePassword = () => {
		const activePatterns = getActivePatterns()
		if (activePatterns.length === 0) {
			setPassword('')
			return
		}
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
		const charsets = []
		if (includeLowercase) charsets.push(CharsetLowercase)
		if (includeUppercase) charsets.push(CharsetUppercase)
		if (includeNumbers) charsets.push(CharsetNumbers)
		if (includeSymbols) charsets.push(CharsetSymbols)
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
		includeLowercase,
		includeNumbers,
		includeSymbols,
		setLength: setLengthClamped,
		setIncludeUppercase,
		setIncludeLowercase,
		setIncludeNumbers,
		setIncludeSymbols,
		generatePassword
	}
}
