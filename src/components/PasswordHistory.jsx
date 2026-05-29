import { useState, useRef, useEffect, useCallback } from 'react'
import { CheckIcon, CopyIcon, ChevronIcon, LockIcon, TrashIcon, PencilIcon, XIcon } from './Icons'
import RelativeTime from './RelativeTime'

export default function PasswordHistory({ history, historyCollapsed, setHistoryCollapsed, clearHistory, clearUnnamedHistory, deleteEntry, renameEntry, lastSavedId, clearLastSavedId }) {
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

	return (
		<div className='bg-slate-800 w-full text-xs'>
			<button
				onClick={() => setHistoryCollapsed(!historyCollapsed)}
				className='w-full flex items-center justify-between p-3 hover:bg-slate-700 transition-colors duration-200'
				aria-expanded={!historyCollapsed}
				aria-label='Toggle history'
			>
				<span className='text-gray-500 font-bold'>HISTORY</span>
				<span className='text-gray-500 w-4 h-4'>
					<ChevronIcon direction={historyCollapsed ? 'right' : 'down'} />
				</span>
			</button>
			<div
				className='grid transition-[grid-template-rows] duration-300 ease-in-out'
				style={{ gridTemplateRows: historyCollapsed ? '0fr' : '1fr' }}
			>
				<div className='overflow-hidden'>
					<div className='border-t border-slate-700'>
						{history.length === 0 ? (
							<p className='p-3 text-gray-500 text-center'>No history yet</p>
						) : (
							<ul ref={listRef} className='divide-y divide-slate-700 max-h-60 overflow-y-auto scrollbar-thin'>
								{sortedHistory.map((entry) => (
									<li
										key={entry.id}
										ref={(el) => { entryRefs.current[entry.id] = el }}
										className={`flex flex-col gap-1 p-3 ${highlightedId === entry.id ? 'flash-highlight' : ''}`}
									>
										<div className='flex items-center gap-2'>
											{editingId === entry.id ? (
												<input
													ref={editRef}
													type='text'
													value={editValue}
													onChange={(e) => setEditValue(e.target.value.slice(0, 30))}
													onKeyDown={(e) => {
														if (e.key === 'Enter') saveEdit(entry.id)
														if (e.key === 'Escape') cancelEdit()
													}}
													onBlur={() => saveEdit(entry.id)}
													placeholder='Name this password'
													maxLength={30}
													className='bg-slate-900 text-gray-300 px-2 py-1 rounded text-xs min-w-0 grow'
													aria-label='Password name'
												/>
											) : (
												<button
													onClick={() => toggleReveal(entry.id)}
													className='text-gray-300 font-mono text-sm truncate min-w-0 grow text-left hover:text-gray-100 transition-colors duration-150'
													aria-label={revealedIds.has(entry.id) ? 'Hide password' : 'Reveal password'}
												>
													{entry.name ? (
														<span className='font-bold text-gray-200'>{entry.name}</span>
													) : (
														<span className='italic text-gray-500'>no-name</span>
													)}
												</button>
											)}
											<span className='text-gray-500 shrink-0'>
												<RelativeTime timestamp={entry.timestamp} />
											</span>
											<button
												onClick={() => startEditing(entry.id, entry.name)}
												className='w-4 shrink-0 hover:text-gray-300 text-gray-500 transition-colors duration-150'
												aria-label='Edit name'
											>
												<PencilIcon />
											</button>
											<button
												onClick={() => handleCopy(entry.id, entry.password)}
												className='w-5 shrink-0 hover:text-gray-300 text-gray-500 transition-colors duration-150'
												aria-label='Copy password'
											>
												{copiedId === entry.id ? (
													<CheckIcon />
												) : (
													<CopyIcon />
												)}
											</button>
											<button
												onClick={() => handleDelete(entry.id, entry.name)}
												className='w-4 shrink-0 hover:text-red-400 text-gray-500 transition-colors duration-150'
												aria-label='Delete entry'
											>
												<TrashIcon />
											</button>
										</div>
										<button
											onClick={() => toggleReveal(entry.id)}
											className='text-gray-500 font-mono text-xs truncate text-left hover:text-gray-400 transition-colors duration-150'
											aria-label={revealedIds.has(entry.id) ? 'Hide password' : 'Reveal password'}
										>
											{revealedIds.has(entry.id) ? entry.password : '••••••••••'}
										</button>
									</li>
								))}
							</ul>
						)}
						{history.length > 0 && (
							<div className='border-t border-slate-700 p-3'>
								<div className='relative'>
									<input
										type='text'
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder='Search history...'
										className='bg-slate-900 text-gray-300 px-3 py-2 pr-8 rounded text-xs w-full focus:outline-none focus:ring-1 focus:ring-gray-300'
										aria-label='Search history'
									/>
									{searchQuery && (
										<button
											onClick={() => setSearchQuery('')}
											className='absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 hover:text-gray-300 transition-colors duration-150'
											aria-label='Clear search'
										>
											<XIcon />
										</button>
									)}
								</div>
							</div>
						)}
						{history.length > 0 && (
							<div className='border-t border-slate-700 p-3'>
								<button
									onClick={handleClear}
									className='text-red-400 hover:text-red-300 font-bold w-full text-center transition-colors duration-150'
									aria-label='Clear history'
								>
									Clear History
								</button>
							</div>
						)}
						<div className='border-t border-slate-700 p-3 text-gray-500 text-center flex items-center justify-center gap-1'>
							<span className='w-4 h-4'><LockIcon /></span>
							<span>All data stays in your browser</span>
						</div>
					</div>
				</div>
			</div>

			<dialog
				ref={deleteDialogRef}
				onClose={closeDeleteDialog}
				onClick={(e) => handleDialogBackdropClick(e, closeDeleteDialog)}
				className='bg-slate-800 text-gray-300 p-6 rounded-lg backdrop:bg-black/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0'
			>
				<form method='dialog' className='grid gap-4'>
					<p className='text-sm'>
						Delete &ldquo;{history.find((e) => e.id === deleteConfirmId)?.name}&rdquo;?
					</p>
					<p className='text-xs text-gray-500'>This action cannot be undone.</p>
					<div className='flex gap-2 justify-end'>
						<button
							type='button'
							onClick={closeDeleteDialog}
							className='px-4 py-2 text-xs bg-slate-700 hover:bg-slate-600 rounded'
						>
							Cancel
						</button>
						<button
							type='submit'
							onClick={confirmDelete}
							className='px-4 py-2 text-xs bg-red-600 hover:bg-red-500 text-white rounded'
						>
							Delete
						</button>
					</div>
				</form>
			</dialog>

			<dialog
				ref={clearDialogRef}
				onClose={closeClearDialog}
				onClick={(e) => handleDialogBackdropClick(e, closeClearDialog)}
				className='bg-slate-800 text-gray-300 p-6 rounded-lg backdrop:bg-black/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0'
			>
				<form method='dialog' className='grid gap-4'>
					<p className='text-sm font-bold'>Clear History</p>
					<p className='text-xs text-gray-400'>
						You have {namedCount} named password{namedCount > 1 ? 's' : ''}.
						Do you want to delete them too?
					</p>
					<div className='flex gap-2 justify-end flex-wrap'>
						<button
							type='button'
							onClick={closeClearDialog}
							className='px-4 py-2 text-xs bg-slate-700 hover:bg-slate-600 rounded'
						>
							Cancel
						</button>
						<button
							type='button'
							onClick={() => {
								clearUnnamedHistory()
								closeClearDialog()
							}}
							className='px-4 py-2 text-xs bg-slate-600 hover:bg-slate-500 rounded'
						>
							Keep Named
						</button>
						<button
							type='button'
							onClick={() => {
								clearHistory()
								closeClearDialog()
							}}
							className='px-4 py-2 text-xs bg-red-600 hover:bg-red-500 text-white rounded'
						>
							Delete All
						</button>
					</div>
				</form>
			</dialog>
		</div>
	)
}
