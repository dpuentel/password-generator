import en from './en.json'
import es from './es.json'
import gl from './gl.json'

const dictionaries = { en, es, gl }

export const DICTIONARY_SIZE = 2048

export const LANGUAGES = [
	{ code: 'en', label: 'English' },
	{ code: 'es', label: 'Español' },
	{ code: 'gl', label: 'Galego' }
]

export const getDictionary = (lang) => dictionaries[lang] || dictionaries.en

export const getBrowserLanguage = () => {
	const code = (navigator.language || 'en').split('-')[0].toLowerCase()
	return dictionaries[code] ? code : 'en'
}
