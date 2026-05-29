export default function Button({ text, onClick, ariaLabel }) {
	return (
		<button
			type='button'
			className='bg-green-300 hover:bg-green-700 text-white text-base font-extrabold py-2 px-4 w-full'
			onClick={onClick}
			aria-label={ariaLabel || text}
		>
			{text}
		</button>
	)
}
