export default function ModeSelector({ mode, setMode }) {
	return (
		<div className='flex gap-2'>
			<button
				type='button'
				onClick={() => setMode('characters')}
				className={`flex-1 py-2 px-3 text-xs font-bold rounded ${
					mode === 'characters'
						? 'bg-slate-600 text-gray-200'
						: 'bg-slate-900 text-gray-500 hover:text-gray-400'
				}`}
				aria-label='Character mode'
			>
				Random (Characters)
			</button>
			<button
				type='button'
				onClick={() => setMode('passphrase')}
				className={`flex-1 py-2 px-3 text-xs font-bold rounded ${
					mode === 'passphrase'
						? 'bg-slate-600 text-gray-200'
						: 'bg-slate-900 text-gray-500 hover:text-gray-400'
				}`}
				aria-label='Passphrase mode'
			>
				Easy to Remember (Words)
			</button>
		</div>
	)
}
