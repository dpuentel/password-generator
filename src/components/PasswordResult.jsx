import { useState, useRef, useEffect } from 'react'
import { CheckIcon, CopyIcon, SaveIcon } from './Icons'

export default function PasswordResult({ password, placeholder, onCopy, onSave }) {
	const [isCopied, setIsCopied] = useState(false)
	const [hasError, setHasError] = useState(false)
	const [showSaveDialog, setShowSaveDialog] = useState(false)
	const [saveName, setSaveName] = useState('')
	const dialogRef = useRef(null)
	const inputRef = useRef(null)

	const passwordColor = password ? 'text-gray-300' : 'text-gray-500'

	useEffect(() => {
		if (showSaveDialog && dialogRef.current) {
			dialogRef.current.showModal()
		}
	}, [showSaveDialog])

	useEffect(() => {
		if (showSaveDialog && inputRef.current) {
			inputRef.current.focus()
		}
	}, [showSaveDialog])

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(password)
			if (onCopy) onCopy()
			setIsCopied(true)
			setTimeout(() => {
				setIsCopied(false)
			}, 1000)
		} catch {
			setHasError(true)
			setTimeout(() => {
				setHasError(false)
			}, 1000)
		}
	}

	const handleSelect = (e) => {
		if (password) {
			window.getSelection().selectAllChildren(e.currentTarget)
		}
	}

	const handleSaveClick = () => {
		setSaveName('')
		setShowSaveDialog(true)
	}

	const closeSaveDialog = () => {
		if (dialogRef.current) {
			dialogRef.current.close()
		}
		setShowSaveDialog(false)
		setSaveName('')
	}

	const confirmSave = () => {
		if (onSave) {
			onSave(saveName.trim().slice(0, 30) || null)
		}
		closeSaveDialog()
	}

	const handleBackdropClick = (e) => {
		if (e.target === e.currentTarget) {
			closeSaveDialog()
		}
	}

	return (
		<div
			className='bg-slate-800 w-full p-4 flex items-center gap-2 text-gray-500'
			role='region'
			aria-label='Generated password'
		>
			<span
				onClick={handleSelect}
				className={`text-lg ${passwordColor} ${isCopied ? 'underline' : ''} font-bold cursor-pointer select-all min-w-0 break-all grow`}
				aria-live='polite'
				aria-label={password ? 'Click to select password' : undefined}
			>
				{password || placeholder}
			</span>
			<button
				type='button'
				onClick={handleSaveClick}
				className='w-5 shrink-0 hover:text-gray-300 ml-auto'
				aria-label='Save password'
				disabled={!password}
			>
				<SaveIcon />
			</button>
			<button
				type='button'
				onClick={handleCopy}
				className='w-5 shrink-0 hover:text-gray-300'
				aria-label='Copy password to clipboard'
			>
				{hasError ? (
					<span className='text-red-500' aria-label='Copy failed'>
						✕
					</span>
				) : isCopied ? (
					<CheckIcon />
				) : (
					<CopyIcon />
				)}
			</button>

			<dialog
				ref={dialogRef}
				onClose={closeSaveDialog}
				onClick={handleBackdropClick}
				onKeyDown={(e) => { if (e.key === 'Escape') closeSaveDialog() }}
				className='bg-slate-800 text-gray-300 p-6 rounded-lg backdrop:bg-black/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0'
			>
				<form method='dialog' className='grid gap-4'>
					<p className='text-sm font-bold'>Save Password</p>
					<input
						ref={inputRef}
						type='text'
						value={saveName}
						onChange={(e) => setSaveName(e.target.value.slice(0, 30))}
						onKeyDown={(e) => {
							if (e.key === 'Enter') confirmSave()
							if (e.key === 'Escape') closeSaveDialog()
						}}
						placeholder='Name this password'
						maxLength={30}
						className='bg-slate-900 text-gray-300 px-3 py-2 rounded text-xs focus:outline-none focus:ring-1 focus:ring-gray-300'
						aria-label='Password name'
					/>
					<div className='flex gap-2 justify-end'>
						<button
							type='button'
							onClick={closeSaveDialog}
							className='px-4 py-2 text-xs bg-slate-700 hover:bg-slate-600 rounded'
						>
							Cancel
						</button>
						<button
							type='submit'
							onClick={confirmSave}
							className='px-4 py-2 text-xs bg-green-600 hover:bg-green-500 text-white rounded'
						>
							Save
						</button>
					</div>
				</form>
			</dialog>
		</div>
	)
}
