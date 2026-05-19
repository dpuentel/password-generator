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

	return (
		<div
			className='bg-slate-800 w-full p-4 items-center text-gray-500'
			role='region'
			aria-label='Generated password'
		>
			<span
				className={`text-lg ${passwordColor} ${isCopied ? 'underline' : ''} font-bold`}
				aria-live='polite'
			>
				{password || placeholder}
			</span>
			<button
				onClick={handleCopy}
				className='w-5 float-right hover:text-gray-300'
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
