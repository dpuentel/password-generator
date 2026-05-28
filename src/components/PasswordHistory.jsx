import { useState } from 'react'
import { CheckIcon, CopyIcon, ChevronIcon, LockIcon } from './Icons'
import RelativeTime from './RelativeTime'

export default function PasswordHistory({ history, historyCollapsed, setHistoryCollapsed, clearHistory }) {
	const [revealedIds, setRevealedIds] = useState(new Set())
	const [copiedId, setCopiedId] = useState(null)

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

	const handleCopy = async (id, password) => {
		try {
			await navigator.clipboard.writeText(password)
			setCopiedId(id)
			setTimeout(() => {
				setCopiedId(null)
			}, 1000)
		} catch {
			// silently fail
		}
	}

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
							<ul className='divide-y divide-slate-700'>
								{history.map((entry) => (
									<li key={entry.id} className='flex items-center gap-2 p-3'>
										<button
											onClick={() => toggleReveal(entry.id)}
											className='text-gray-300 font-mono text-sm truncate min-w-0 grow text-left hover:text-gray-100 transition-colors duration-150'
											aria-label={revealedIds.has(entry.id) ? 'Hide password' : 'Reveal password'}
										>
											{revealedIds.has(entry.id) ? entry.password : '••••••••••'}
										</button>
										<span className='text-gray-500 shrink-0'>
											<RelativeTime timestamp={entry.timestamp} />
										</span>
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
									</li>
								))}
							</ul>
						)}
						{history.length > 0 && (
							<div className='border-t border-slate-700 p-3'>
								<button
									onClick={clearHistory}
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
		</div>
	)
}
