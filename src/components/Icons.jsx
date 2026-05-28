export const ChevronIcon = ({ direction = 'down' }) => {
	const rotations = { down: 0, up: 180, right: -90 }
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 24 24'
			fill='none'
			stroke='currentColor'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
			className='transition-transform duration-300'
			style={{ transform: `rotate(${rotations[direction]}deg)` }}
		>
			<title>Chevron</title>
			<polyline points='6 9 12 15 18 9' />
		</svg>
	)
}

export const LockIcon = () => (
	<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
		<title>Lock</title>
		<rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
		<path d='M7 11V7a5 5 0 0110 0v4' />
	</svg>
)

export const CopyIcon = () => (
	<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
		<title>Copy</title>
		<rect
			x='128'
			y='128'
			width='336'
			height='336'
			rx='57'
			ry='57'
			fill='none'
			stroke='currentColor'
			strokeLinejoin='round'
			strokeWidth='32'
		/>
		<path
			d='M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24'
			fill='none'
			stroke='currentColor'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='32'
		/>
	</svg>
)

export const CheckIcon = () => (
	<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
		<title>Checkmark Done</title>
		<path
			fill='none'
			stroke='currentColor'
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth='32'
			d='M464 128L240 384l-96-96M144 384l-96-96M368 128L232 284'
		/>
	</svg>
)
