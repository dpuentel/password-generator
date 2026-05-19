import { useState } from 'react'
import { CheckIcon, CopyIcon } from './Icons'

export default function PasswordResult({ password, placeholder }) {
	const [isCopied, setIsCopied] = useState(false)
	const [hasError, setHasError] = useState(false)

	const passwordColor = password ? 'text-gray-300' : 'text-gray-500'

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(password)
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
				onClick={handleCopy}
				className='w-5 shrink-0 hover:text-gray-300 ml-auto'
				aria-label='Copy password to clipboard'
			>
				{hasError ? (
					<span className='text-red-500' aria-label='Copy failed'>✕</span>
				) : isCopied ? (
					<CheckIcon />
				) : (
					<CopyIcon />
				)}
			</button>
		</div>
	)
}
