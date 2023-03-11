import PasswordResult from './PasswordResult'
import PasswordLength from './PasswordLength'
import RangeSlider from './RangeSlider'
import CheckboxLabeled from './CheckboxLabeled'
import Button from './Button'
import PasswordStrength from './PasswordStrength'
import { useGeneratePasword } from '../hooks/useGeneratePassword'

export default function PasswordGenerator() {
	const {
		password,
		length,
		setLength,
		includeUppercase,
		setIncludeUppercase,
		includeNumbers,
		setIncludeNumbers,
		includeSymbols,
		setIncludeSymbols,
		generatePassword
	} = useGeneratePasword()

	const handleChangeCheckboxUpperCase = (e) => {
		setIncludeUppercase(e.target.checked)
	}

	const handleChangeCheckboxNumbers = (e) => {
		setIncludeNumbers(e.target.checked)
	}

	const handleChangeCheckboxSymbols = (e) => {
		setIncludeSymbols(e.target.checked)
	}

	return (
		<section className='grid grid-cols-1 gap-4 place-items-center'>
			<article className='w-80'>
				<PasswordResult password={password} placeholder='P4$5W0rD!' size='5' />
			</article>
			<article className='bg-slate-800 min-w-48 w-80 p-4 grid grid-cols-1 gap-4 text-xs'>
				<PasswordLength length={length} />
				<RangeSlider
					min='4'
					max='24'
					value={length}
					onChange={(e) => setLength(e.target.value)}
					className='
			form-range
			appearance-none
			w-full
			h-6
			p-0
			bg-transparent
			focus:outline-none focus:ring-0 focus:shadow-none
			col-span-2
		'
				/>
				<CheckboxLabeled
					label='Include Uppercase Letters'
					checked={includeUppercase}
					onChange={handleChangeCheckboxUpperCase}
				/>
				<CheckboxLabeled
					label='Include Numbers'
					checked={includeNumbers}
					onChange={handleChangeCheckboxNumbers}
				/>
				<CheckboxLabeled
					label='Include Symbols'
					checked={includeSymbols}
					onChange={handleChangeCheckboxSymbols}
				/>
				<PasswordStrength password={password} />
				<Button onClick={generatePassword} text={'GENERATE 🡆'} />
			</article>
		</section>
	)
}
