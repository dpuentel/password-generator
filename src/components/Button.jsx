export default function Button({ text, onClick, ariaLabel }) {
	return (
		<button
			className='bg-green-300 hover:bg-green-700 text-slate-800 text-base font-extrabold py-2 px-4 w-full'
			onClick={onClick}
			aria-label={ariaLabel || text}
		>
			{text}
		</button>
	)
}
