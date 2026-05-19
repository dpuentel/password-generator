export default function CheckboxLabeled({ label, checked, onChange, disabled }) {
	return (
		<label className={`flex items-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
			<input
				type='checkbox'
				className='bg-slate-800 checked:before:bg-slate-800 before:bg-slate-800 accent-slate-800 focus:ring-1 focus:ring-gray-300 ring-1 ring-gray-300 checked:ring-1 checked:ring-gray-300 checked:ring-offset-1 checked:ring-offset-gray-800 text-green-400'
				checked={checked}
				onChange={onChange}
				disabled={disabled}
			/>
			<span className='ml-2'>{label}</span>
		</label>
	)
}
