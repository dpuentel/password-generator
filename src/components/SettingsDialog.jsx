import RangeSlider from './RangeSlider'

export default function SettingsDialog({
	settingsDialogRef,
	clipboardPermissionGranted,
	tempClipboardTimeout,
	setTempClipboardTimeout,
	onCancel,
	onSave,
	onRequestPermission
}) {
	return (
		<dialog
			ref={settingsDialogRef}
			onClose={onCancel}
			onKeyDown={(e) => {
				if (e.key === 'Escape') onCancel()
			}}
			className='bg-slate-800 text-gray-300 p-6 rounded-lg backdrop:bg-black/50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 m-0 min-w-72'
		>
			<form className='grid gap-4'>
				<p className='text-sm font-bold'>Settings</p>
				<div className='grid grid-cols-1 gap-3'>
					<div className='flex items-center justify-between gap-4'>
						<label htmlFor='clipboard-timeout' className='text-xs text-gray-400 shrink-0'>
							Clipboard auto-clear:
						</label>
						<span className='text-xs text-gray-300 font-bold w-12 text-right'>
							{tempClipboardTimeout === 0 ? 'Off' : `${tempClipboardTimeout}s`}
						</span>
					</div>
					{clipboardPermissionGranted ? (
						<RangeSlider
							id='clipboard-timeout'
							min='0'
							max='350'
							value={tempClipboardTimeout}
							onChange={(e) => setTempClipboardTimeout(Number(e.target.value))}
							ariaLabel='Clipboard timeout in seconds'
						/>
					) : (
						<button
							type='button'
							onClick={onRequestPermission}
							className='px-3 py-2 text-xs bg-slate-700 hover:bg-slate-600 rounded text-center'
						>
							Allow clipboard access to enable
						</button>
					)}
					<div className='flex justify-between text-xs text-gray-500'>
						<span>Off</span>
						<span>350s</span>
					</div>
				</div>
				<div className='flex gap-2 justify-end'>
					<button
						type='button'
						onClick={onCancel}
						className='px-4 py-2 text-xs bg-slate-700 hover:bg-slate-600 rounded'
					>
						Cancel
					</button>
					<button
						type='button'
						onClick={onSave}
						className='px-4 py-2 text-xs bg-green-600 hover:bg-green-500 text-white rounded'
					>
						Save
					</button>
				</div>
			</form>
		</dialog>
	)
}
