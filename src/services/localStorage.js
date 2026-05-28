const STORAGE_KEY = 'password-generator-settings'

export const loadSettings = () => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		return raw ? JSON.parse(raw) : null
	} catch {
		return null
	}
}

export const saveSettings = (settings) => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
	} catch {
		// silently fail if localStorage is unavailable
	}
}
