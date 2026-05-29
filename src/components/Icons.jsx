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
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
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

export const TrashIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<title>Delete</title>
		<polyline points='3 6 5 6 21 6' />
		<path d='M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2' />
	</svg>
)

export const PencilIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<title>Edit</title>
		<path d='M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7' />
		<path d='M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z' />
	</svg>
)

export const XIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<title>Clear</title>
		<line x1='18' y1='6' x2='6' y2='18' />
		<line x1='6' y1='6' x2='18' y2='18' />
	</svg>
)

export const SaveIcon = () => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
	>
		<title>Save</title>
		<path d='M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z' />
		<polyline points='17 21 17 13 7 13 7 21' />
		<polyline points='7 3 7 8 15 8' />
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
