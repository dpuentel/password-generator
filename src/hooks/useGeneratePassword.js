import { useReducer, useEffect } from 'react'
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
import { loadHistory, saveHistory, addEntry, clearHistory as clearHistoryStorage, loadCollapsed, saveCollapsed } from '../services/sessionStorage'

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

const clampLength = (value) => {
	const num = Number(value)
	if (isNaN(num)) return MIN_LENGTH
	return Math.min(MAX_LENGTH, Math.max(MIN_LENGTH, num))
}

const getActiveCharsetCount = (state) => {
	let count = 0
	if (state.includeLowercase) count++
	if (state.includeUppercase) count++
	if (state.includeNumbers) count++
	if (state.includeSymbols) count++
	return count
}

const getActivePatterns = (state) => {
	const charsets = []
	if (state.excludeAmbiguous) {
		if (state.includeLowercase) charsets.push(CharsetLowercaseNoAmbiguous)
		if (state.includeUppercase) charsets.push(CharsetUppercaseNoAmbiguous)
		if (state.includeNumbers) charsets.push(CharsetNumbersNoAmbiguous)
		if (state.includeSymbols) charsets.push(CharsetSymbolsNoAmbiguous)
	} else {
		if (state.includeLowercase) charsets.push(CharsetLowercase)
		if (state.includeUppercase) charsets.push(CharsetUppercase)
		if (state.includeNumbers) charsets.push(CharsetNumbers)
		if (state.includeSymbols) charsets.push(CharsetSymbols)
	}
	return charsets
}

const getRandomInt = (max) => {
	const result = new Uint32Array(1)
	window.crypto.getRandomValues(result)
	return result[0] % max
}

const shuffle = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = getRandomInt(i + 1)
		;[array[i], array[j]] = [array[j], array[i]]
	}
	return array
}

const generateCharacterPassword = (state) => {
	const activePatterns = getActivePatterns(state)
	const charactersByPattern = Math.floor(state.length / activePatterns.length)
	let pwd = ''

	activePatterns.forEach((charset) => {
		for (let i = 0; i < charactersByPattern; i++) {
			pwd += charset[getRandomInt(charset.length)]
		}
	})

	const remainingChars = state.length - pwd.length
	const lastCharset = activePatterns[activePatterns.length - 1]
	for (let i = 0; i < remainingChars; i++) {
		pwd += lastCharset[getRandomInt(lastCharset.length)]
	}

	pwd = shuffle([...pwd]).join('')

	return { password: pwd, entropy: PasswordEntropyCalculator(pwd) }
}

const generatePassphrase = (state) => {
	const dictionary = getDictionary(state.language)
	const words = []
	for (let i = 0; i < state.wordCount; i++) {
		words.push(dictionary[getRandomInt(dictionary.length)])
	}
	const pwd = words.join(state.separator)
	return { password: pwd, entropy: PassphraseEntropyCalculator(state.wordCount, DICTIONARY_SIZE) }
}

const createHistoryEntry = (password, mode) => ({
	id: Date.now().toString(),
	password,
	mode,
	timestamp: Date.now()
})

const reducer = (state, action) => {
	switch (action.type) {
	case 'SET_MODE':
		return { ...state, mode: action.value }
	case 'SET_LENGTH':
		return { ...state, length: clampLength(action.value) }
	case 'SET_INCLUDE_UPPERCASE':
		if (!action.value && getActiveCharsetCount(state) <= 1) return state
		return { ...state, includeUppercase: action.value }
	case 'SET_INCLUDE_LOWERCASE':
		if (!action.value && getActiveCharsetCount(state) <= 1) return state
		return { ...state, includeLowercase: action.value }
	case 'SET_INCLUDE_NUMBERS':
		if (!action.value && getActiveCharsetCount(state) <= 1) return state
		return { ...state, includeNumbers: action.value }
	case 'SET_INCLUDE_SYMBOLS':
		if (!action.value && getActiveCharsetCount(state) <= 1) return state
		return { ...state, includeSymbols: action.value }
	case 'SET_EXCLUDE_AMBIGUOUS':
		return { ...state, excludeAmbiguous: action.value }
	case 'SET_WORD_COUNT':
		return { ...state, wordCount: action.value }
	case 'SET_SEPARATOR':
		return { ...state, separator: action.value }
	case 'SET_LANGUAGE':
		return { ...state, language: action.value }
	case 'SET_PASSWORD':
		return { ...state, password: action.password, entropy: action.entropy }
	case 'ADD_TO_HISTORY': {
		const entry = createHistoryEntry(state.password, state.mode)
		const updatedHistory = addEntry(state.history, entry)
		saveHistory(updatedHistory)
		return { ...state, history: updatedHistory }
	}
	case 'CLEAR_HISTORY':
		clearHistoryStorage()
		return { ...state, history: [] }
	case 'SET_HISTORY_COLLAPSED':
		saveCollapsed(action.value)
		return { ...state, historyCollapsed: action.value }
	case 'RESTORE_SETTINGS':
		return { ...state, ...action.settings }
	}
}

export function useGeneratePassword() {
	const defaults = getDefaults()

	const [state, dispatch] = useReducer(reducer, {
		...defaults,
		password: '',
		entropy: 0,
		history: [],
		historyCollapsed: true
	})

	useEffect(() => {
		const saved = loadSettings()
		if (saved) {
			dispatch({ type: 'RESTORE_SETTINGS', settings: saved })
		}
		const history = loadHistory()
		if (history.length > 0) {
			dispatch({ type: 'RESTORE_SETTINGS', settings: { history } })
		}
		const collapsed = loadCollapsed()
		if (!collapsed) {
			dispatch({ type: 'RESTORE_SETTINGS', settings: { historyCollapsed: collapsed } })
		}
	}, [])

	useEffect(() => {
		const { mode, length, includeUppercase, includeLowercase, includeNumbers,
			includeSymbols, excludeAmbiguous, wordCount, separator, language } = state
		saveSettings({
			mode, length, includeUppercase, includeLowercase, includeNumbers,
			includeSymbols, excludeAmbiguous, wordCount, separator, language
		})
	}, [state])

	useEffect(() => {
		const result = state.mode === 'passphrase'
			? generatePassphrase(state)
			: generateCharacterPassword(state)
		dispatch({ type: 'SET_PASSWORD', ...result })
	}, [state.mode, state.length, state.includeUppercase, state.includeLowercase, state.includeNumbers, state.includeSymbols, state.excludeAmbiguous, state.wordCount, state.separator, state.language])

	const maxEntropy = state.mode === 'passphrase' ? PASSPHRASE_MAX_ENTROPY : CHARACTERS_MAX_ENTROPY

	return {
		password: state.password,
		mode: state.mode,
		setMode: (value) => dispatch({ type: 'SET_MODE', value }),
		length: state.length,
		includeUppercase: state.includeUppercase,
		includeLowercase: state.includeLowercase,
		includeNumbers: state.includeNumbers,
		includeSymbols: state.includeSymbols,
		excludeAmbiguous: state.excludeAmbiguous,
		wordCount: state.wordCount,
		separator: state.separator,
		language: state.language,
		entropy: state.entropy,
		maxEntropy,
		history: state.history,
		historyCollapsed: state.historyCollapsed,
		setLength: (value) => dispatch({ type: 'SET_LENGTH', value }),
		setIncludeUppercase: (value) => dispatch({ type: 'SET_INCLUDE_UPPERCASE', value }),
		setIncludeLowercase: (value) => dispatch({ type: 'SET_INCLUDE_LOWERCASE', value }),
		setIncludeNumbers: (value) => dispatch({ type: 'SET_INCLUDE_NUMBERS', value }),
		setIncludeSymbols: (value) => dispatch({ type: 'SET_INCLUDE_SYMBOLS', value }),
		setExcludeAmbiguous: (value) => dispatch({ type: 'SET_EXCLUDE_AMBIGUOUS', value }),
		setWordCount: (value) => dispatch({ type: 'SET_WORD_COUNT', value }),
		setSeparator: (value) => dispatch({ type: 'SET_SEPARATOR', value }),
		setLanguage: (value) => dispatch({ type: 'SET_LANGUAGE', value }),
		generatePassword: () => {
			const result = state.mode === 'passphrase'
				? generatePassphrase(state)
				: generateCharacterPassword(state)
			dispatch({ type: 'SET_PASSWORD', ...result })
			dispatch({ type: 'ADD_TO_HISTORY' })
		},
		saveCurrentToHistory: () => dispatch({ type: 'ADD_TO_HISTORY' }),
		clearHistory: () => dispatch({ type: 'CLEAR_HISTORY' }),
		setHistoryCollapsed: (value) => dispatch({ type: 'SET_HISTORY_COLLAPSED', value })
	}
}
