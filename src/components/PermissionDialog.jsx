export default function PermissionDialog({ permissionDialogRef, onClose, onAllowAccess }) {
	return (
		<dialog
			ref={permissionDialogRef}
			onClose={onClose}
			onKeyDown={(e) => {
				if (e.key === 'Escape') onClose()
			}}
			className='bg-slate-800 text-gray-300 p-6 rounded-lg backdrop:bg-black/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 min-w-80'
		>
			<form className='grid gap-4' onSubmit={(e) => e.preventDefault()}>
				<p className='text-sm font-bold text-red-400'>Clipboard Access Required</p>
				<p className='text-xs text-gray-400'>
					The auto-clear clipboard feature requires permission to access your clipboard.
				</p>
				<div className='text-xs text-gray-300 bg-slate-900 p-3 rounded'>
					<p className='font-bold mb-2'>To re-enable auto-clear:</p>
					<ol className='list-decimal list-inside space-y-1 text-gray-400'>
						<li>Click "Allow Access" below</li>
						<li>When your browser asks, allow clipboard access</li>
						<li>Open settings and set your desired timeout</li>
					</ol>
				</div>
				<div className='flex gap-2 justify-end'>
					<button
						type='button'
						onClick={onClose}
						className='px-4 py-2 text-xs bg-slate-700 hover:bg-slate-600 rounded'
					>
						Close
					</button>
					<button
						type='button'
						onClick={onAllowAccess}
						className='px-4 py-2 text-xs bg-green-600 hover:bg-green-500 text-white rounded'
					>
						Allow Access
					</button>
				</div>
			</form>
		</dialog>
	)
}
