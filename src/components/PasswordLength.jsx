export default function PasswordLength({ length, label = 'Character Length' }) {
	return (
		<div className=''>
			<span>{label}</span>
			<span className='float-right text-base font-bold'>{length}</span>
		</div>
	)
}
