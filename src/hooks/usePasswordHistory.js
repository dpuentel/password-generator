import { useState, useRef, useEffect, useCallback } from 'react'

export function usePasswordHistory({
	history,
	historyCollapsed,
	setHistoryCollapsed,
	clearHistory,
	clearUnnamedHistory,
	deleteEntry,
	renameEntry,
	lastSavedId,
	clearLastSavedId
}) {
	const [revealedIds, setRevealedIds] = useState(new Set())
	const [copiedId, setCopiedId] = useState(null)
	const [editingId, setEditingId] = useState(null)
	const [editValue, setEditValue] = useState('')
	const [deleteConfirmId, setDeleteConfirmId] = useState(null)
	const [showClearDialog, setShowClearDialog] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [highlightedId, setHighlightedId] = useState(null)
	const editRef = useRef(null)
	const clearDialogRef = useRef(null)
	const deleteDialogRef = useRef(null)
	const listRef = useRef(null)
	const entryRefs = useRef({})

	useEffect(() => {
		if (editingId && editRef.current) {
			editRef.current.focus()
			editRef.current.select()
		}
	}, [editingId])

	useEffect(() => {
		if (showClearDialog && clearDialogRef.current) {
			clearDialogRef.current.showModal()
		}
	}, [showClearDialog])

	useEffect(() => {
		if (deleteConfirmId && deleteDialogRef.current) {
			deleteDialogRef.current.showModal()
		}
	}, [deleteConfirmId])

	const applyHighlight = (id) => {
		setHighlightedId(id)
		setTimeout(() => setHighlightedId(null), 1800)
	}

	const scrollToAndHighlight = useCallback((id) => {
		const entryEl = entryRefs.current[id]
		const listEl = listRef.current
		if (!entryEl || !listEl) return

		const entryRect = entryEl.getBoundingClientRect()
		const listRect = listEl.getBoundingClientRect()

		const isVisible = entryRect.top >= listRect.top && entryRect.bottom <= listRect.bottom

		if (!isVisible) {
			entryEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
			setTimeout(() => applyHighlight(id), 300)
		} else {
			applyHighlight(id)
		}
	}, [])

	useEffect(() => {
		if (lastSavedId) {
			if (historyCollapsed) {
				setHistoryCollapsed(false)
			}
			setTimeout(() => {
				scrollToAndHighlight(lastSavedId)
				clearLastSavedId()
			}, historyCollapsed ? 350 : 0)
		}
	}, [lastSavedId, scrollToAndHighlight, clearLastSavedId, historyCollapsed, setHistoryCollapsed])

	const toggleReveal = (id) => {
		setRevealedIds((prev) => {
			const next = new Set(prev)
			if (next.has(id)) {
				next.delete(id)
			} else {
				next.add(id)
			}
			return next
		})
	}

	const resetCopied = () => setCopiedId(null)

	const handleCopy = async (id, password) => {
		try {
			await navigator.clipboard.writeText(password)
			setCopiedId(id)
			setTimeout(resetCopied, 1000)
		} catch {
			// silently fail
		}
	}

	const startEditing = (id, currentName) => {
		setEditingId(id)
		setEditValue(currentName || '')
	}

	const saveEdit = (id) => {
		renameEntry(id, editValue)
		setEditingId(null)
		setEditValue('')
		scrollToAndHighlight(id)
	}

	const cancelEdit = () => {
		setEditingId(null)
		setEditValue('')
	}

	const handleDelete = (id, name) => {
		if (name) {
			setDeleteConfirmId(id)
		} else {
			deleteEntry(id)
		}
	}

	const confirmDelete = () => {
		if (deleteConfirmId) {
			deleteEntry(deleteConfirmId)
		}
		closeDeleteDialog()
	}

	const closeDeleteDialog = () => {
		if (deleteDialogRef.current) {
			deleteDialogRef.current.close()
		}
		setDeleteConfirmId(null)
	}

	const handleClear = () => {
		const namedCount = history.filter((e) => e.name).length
		if (namedCount > 0) {
			setShowClearDialog(true)
		} else {
			clearHistory()
		}
	}

	const closeClearDialog = () => {
		if (clearDialogRef.current) {
			clearDialogRef.current.close()
		}
		setShowClearDialog(false)
	}

	const handleDialogBackdropClick = (e, closeFn) => {
		if (e.target === e.currentTarget) {
			closeFn()
		}
	}

	const query = searchQuery.toLowerCase()
	const sortedHistory = [...history]
		.filter((e) => {
			if (!query) return true
			return (
				(e.name && e.name.toLowerCase().includes(query)) ||
				e.password.toLowerCase().includes(query)
			)
		})
		.sort((a, b) => {
			if (!a.name && b.name) return -1
			if (a.name && !b.name) return 1
			if (a.name && b.name) return a.name.localeCompare(b.name)
			return b.timestamp - a.timestamp
		})

	const namedCount = history.filter((e) => e.name).length

	return {
		revealedIds,
		copiedId,
		editingId,
		editValue,
		deleteConfirmId,
		showClearDialog,
		searchQuery,
		highlightedId,
		setSearchQuery,
		setEditValue,
		editRef,
		clearDialogRef,
		deleteDialogRef,
		listRef,
		entryRefs,
		sortedHistory,
		namedCount,
		toggleReveal,
		handleCopy,
		startEditing,
		saveEdit,
		cancelEdit,
		handleDelete,
		confirmDelete,
		closeDeleteDialog,
		handleClear,
		closeClearDialog,
		handleDialogBackdropClick
	}
}
