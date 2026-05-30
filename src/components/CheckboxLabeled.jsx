export default function CheckboxLabeled({ label, checked, onChange, disabled }) {
	return (
		<label className={`flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
			<input
				type='checkbox'
				className='size-4 rounded border-gray-400 bg-slate-800 text-green-400 focus:ring-1 focus:ring-gray-300 accent-slate-800 cursor-pointer'
				checked={checked}
				onChange={onChange}
				disabled={disabled}
			/>
			<span className='ml-2'>{label}</span>
		</label>
	)
}
