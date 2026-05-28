const HISTORY_KEY = 'password-generator-history'
const COLLAPSED_KEY = 'password-generator-history-collapsed'
const MAX_ENTRIES = 5

export const loadHistory = () => {
	try {
		const raw = localStorage.getItem(HISTORY_KEY)
		return raw ? JSON.parse(raw) : []
	} catch {
		return []
	}
}

export const saveHistory = (entries) => {
	try {
		localStorage.setItem(HISTORY_KEY, JSON.stringify(entries))
	} catch {
		// silently fail if localStorage is unavailable
	}
}

export const addEntry = (entries, entry) => {
	return [entry, ...entries].slice(0, MAX_ENTRIES)
}

export const clearHistory = () => {
	try {
		localStorage.removeItem(HISTORY_KEY)
	} catch {
		// silently fail
	}
}

export const loadCollapsed = () => {
	try {
		const raw = localStorage.getItem(COLLAPSED_KEY)
		return raw ? JSON.parse(raw) : true
	} catch {
		return true
	}
}

export const saveCollapsed = (collapsed) => {
	try {
		localStorage.setItem(COLLAPSED_KEY, JSON.stringify(collapsed))
	} catch {
		// silently fail
	}
}
