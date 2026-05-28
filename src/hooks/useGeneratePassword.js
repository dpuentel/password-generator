import { useState, useEffect, useRef } from 'react'
import {
	CharsetSymbols,
	CharsetNumbers,
	CharsetUppercase,
	CharsetLowercase,
	CharsetSymbolsNoAmbiguous,
	CharsetNumbersNoAmbiguous,
	CharsetUppercaseNoAmbiguous,
	CharsetLowercaseNoAmbiguous
} from '../services/Patterns'
import { getDictionary, getBrowserLanguage, DICTIONARY_SIZE } from '../services/dictionaries'
import { PasswordEntropyCalculator, PassphraseEntropyCalculator } from '../services/PasswordEntropyCalculator'
import { loadSettings, saveSettings } from '../services/localStorage'

const MIN_LENGTH = 4
const MAX_LENGTH = 64
const PASSPHRASE_MAX_ENTROPY = 77
const CHARACTERS_MAX_ENTROPY = 426

const getDefaults = () => ({
	mode: 'characters',
	length: 10,
	includeUppercase: false,
	includeLowercase: true,
	includeNumbers: false,
	includeSymbols: false,
	excludeAmbiguous: false,
	wordCount: 4,
	separator: '-',
	language: getBrowserLanguage()
})

export function useGeneratePassword() {
	const defaults = getDefaults()
	const saved = useRef(loadSettings())

	const [mode, setMode] = useState(saved.current?.mode ?? defaults.mode)
	const [length, setLength] = useState(saved.current?.length ?? defaults.length)
	const [includeUppercase, setIncludeUppercase] = useState(saved.current?.includeUppercase ?? defaults.includeUppercase)
	const [includeLowercase, setIncludeLowercase] = useState(saved.current?.includeLowercase ?? defaults.includeLowercase)
	const [includeNumbers, setIncludeNumbers] = useState(saved.current?.includeNumbers ?? defaults.includeNumbers)
	const [includeSymbols, setIncludeSymbols] = useState(saved.current?.includeSymbols ?? defaults.includeSymbols)
	const [excludeAmbiguous, setExcludeAmbiguous] = useState(saved.current?.excludeAmbiguous ?? defaults.excludeAmbiguous)
	const [wordCount, setWordCount] = useState(saved.current?.wordCount ?? defaults.wordCount)
	const [separator, setSeparator] = useState(saved.current?.separator ?? defaults.separator)
	const [language, setLanguage] = useState(saved.current?.language ?? defaults.language)
	const [password, setPassword] = useState('')
	const [entropy, setEntropy] = useState(0)

	useEffect(() => {
		saveSettings({
			mode, length, includeUppercase, includeLowercase, includeNumbers,
			includeSymbols, excludeAmbiguous, wordCount, separator, language
		})
	}, [mode, length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeAmbiguous, wordCount, separator, language])

	useEffect(() => {
		generatePassword()
	}, [mode, length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeAmbiguous, wordCount, separator, language])

	const clampLength = (value) => {
		const num = Number(value)
		if (isNaN(num)) return MIN_LENGTH
		return Math.min(MAX_LENGTH, Math.max(MIN_LENGTH, num))
	}

	const setLengthClamped = (value) => {
		setLength(clampLength(value))
	}

	const getActiveCharsetCount = () => {
		let count = 0
		if (includeLowercase) count++
		if (includeUppercase) count++
		if (includeNumbers) count++
		if (includeSymbols) count++
		return count
	}

	const safeSetCharset = (setter, currentValue) => (newValue) => {
		if (!newValue && getActiveCharsetCount() <= 1) return
		setter(newValue)
	}

	const generatePassword = () => {
		if (mode === 'passphrase') {
			generatePassphrase()
		} else {
			generateCharacterPassword()
		}
	}

	const generateCharacterPassword = () => {
		const activePatterns = getActivePatterns()
		const charactersByPattern = Math.floor(length / activePatterns.length)
		let pwd = ''

		activePatterns.forEach((charset) => {
			for (let i = 0; i < charactersByPattern; i++) {
				pwd += charset[getRandomInt(charset.length)]
			}
		})

		const remainingChars = length - pwd.length
		const lastCharset = activePatterns[activePatterns.length - 1]
		for (let i = 0; i < remainingChars; i++) {
			pwd += lastCharset[getRandomInt(lastCharset.length)]
		}

		pwd = shuffle([...pwd]).join('')

		setPassword(pwd)
		setEntropy(PasswordEntropyCalculator(pwd))
	}

	const generatePassphrase = () => {
		const dictionary = getDictionary(language)
		const words = []
		for (let i = 0; i < wordCount; i++) {
			words.push(dictionary[getRandomInt(dictionary.length)])
		}
		const pwd = words.join(separator)
		setPassword(pwd)
		setEntropy(PassphraseEntropyCalculator(wordCount, DICTIONARY_SIZE))
	}

	const getActivePatterns = () => {
		const charsets = []
		if (excludeAmbiguous) {
			if (includeLowercase) charsets.push(CharsetLowercaseNoAmbiguous)
			if (includeUppercase) charsets.push(CharsetUppercaseNoAmbiguous)
			if (includeNumbers) charsets.push(CharsetNumbersNoAmbiguous)
			if (includeSymbols) charsets.push(CharsetSymbolsNoAmbiguous)
		} else {
			if (includeLowercase) charsets.push(CharsetLowercase)
			if (includeUppercase) charsets.push(CharsetUppercase)
			if (includeNumbers) charsets.push(CharsetNumbers)
			if (includeSymbols) charsets.push(CharsetSymbols)
		}
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

	const maxEntropy = mode === 'passphrase' ? PASSPHRASE_MAX_ENTROPY : CHARACTERS_MAX_ENTROPY

	return {
		password,
		mode,
		setMode,
		length,
		includeUppercase,
		includeLowercase,
		includeNumbers,
		includeSymbols,
		excludeAmbiguous,
		wordCount,
		separator,
		language,
		entropy,
		maxEntropy,
		setLength: setLengthClamped,
		setIncludeUppercase: safeSetCharset(setIncludeUppercase, includeUppercase),
		setIncludeLowercase: safeSetCharset(setIncludeLowercase, includeLowercase),
		setIncludeNumbers: safeSetCharset(setIncludeNumbers, includeNumbers),
		setIncludeSymbols: safeSetCharset(setIncludeSymbols, includeSymbols),
		setExcludeAmbiguous,
		setWordCount,
		setSeparator,
		setLanguage,
		generatePassword
	}
}
