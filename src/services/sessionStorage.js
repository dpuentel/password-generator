const HISTORY_KEY = 'password-generator-history'
const COLLAPSED_KEY = 'password-generator-history-collapsed'
const MAX_ENTRIES = 4

const encode = (str) => {
	try {
		return btoa(encodeURIComponent(str))
	} catch {
		return str
	}
}

const decode = (str) => {
	try {
		return decodeURIComponent(atob(str))
	} catch {
		return str
	}
}

export const loadHistory = () => {
	try {
		const raw = localStorage.getItem(HISTORY_KEY)
		if (!raw) return []
		const entries = JSON.parse(raw)
		return entries.map((entry) => ({
			...entry,
			password: decode(entry.password)
		}))
	} catch {
		return []
	}
}

export const saveHistory = (entries) => {
	try {
		const encoded = entries.map((entry) => ({
			...entry,
			password: encode(entry.password)
		}))
		localStorage.setItem(HISTORY_KEY, JSON.stringify(encoded))
	} catch {
		// silently fail if localStorage is unavailable
	}
}

export const addEntry = (entries, entry) => {
	const updated = [entry, ...entries]
	if (entry.name) return updated

	const result = []
	let unnamedCount = 0
	for (const e of updated) {
		if (e.name || unnamedCount < MAX_ENTRIES) {
			result.push(e)
			if (!e.name) unnamedCount++
		}
	}
	return result
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
