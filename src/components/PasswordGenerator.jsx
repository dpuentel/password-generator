import PasswordResult from './PasswordResult'
import PasswordLength from './PasswordLength'
import RangeSlider from './RangeSlider'
import CheckboxLabeled from './CheckboxLabeled'
import Button from './Button'
import PasswordStrength from './PasswordStrength'
import ModeSelector from './ModeSelector'
import PassphraseOptions from './PassphraseOptions'
import PasswordHistory from './PasswordHistory'
import CopyCountdown from './CopyCountdown'
import { useGeneratePassword } from '../hooks/useGeneratePassword'
import { useState, useEffect, useRef } from 'react'

export default function PasswordGenerator() {
	const {
		password,
		mode,
		setMode,
		length,
		setLength,
		includeUppercase,
		setIncludeUppercase,
		includeLowercase,
		setIncludeLowercase,
		includeNumbers,
		setIncludeNumbers,
		includeSymbols,
		setIncludeSymbols,
		excludeAmbiguous,
		setExcludeAmbiguous,
		wordCount,
		setWordCount,
		separator,
		setSeparator,
		language,
		setLanguage,
		clipboardTimeout,
		setClipboardTimeout,
		entropy,
		maxEntropy,
		history,
		historyCollapsed,
		setHistoryCollapsed,
		clearHistory,
		clearUnnamedHistory,
		deleteEntry,
		renameEntry,
		generatePassword,
		saveCurrentToHistory,
		saveNamedToHistory,
		lastSavedId,
		clearLastSavedId
	} = useGeneratePassword()

	const [countdownRemaining, setCountdownRemaining] = useState(0)
	const [countdownTotal, setCountdownTotal] = useState(0)
	const countdownRef = useRef(null)

	const startCountdown = () => {
		if (clipboardTimeout <= 0) return

		if (countdownRef.current) {
			clearInterval(countdownRef.current)
		}

		setCountdownTotal(clipboardTimeout)
		setCountdownRemaining(clipboardTimeout)

		countdownRef.current = setInterval(() => {
			setCountdownRemaining((prev) => {
				if (prev <= 1) {
					clearInterval(countdownRef.current)
					navigator.clipboard.writeText('').catch(() => {})
					setCountdownRemaining(0)
					return 0
				}
				return prev - 1
			})
		}, 1000)
	}

	useEffect(() => {
		return () => {
			if (countdownRef.current) {
				clearInterval(countdownRef.current)
			}
		}
	}, [])

	const activeCount = [includeLowercase, includeUppercase, includeNumbers, includeSymbols].filter(
		Boolean
	).length
	const isLastCharset = activeCount <= 1

	const placeholder = 'P4$5W0rD!'

	return (
		<section className='grid grid-cols-1 gap-4 place-items-center'>
			<article className='w-80'>
				<CopyCountdown remaining={countdownRemaining} total={countdownTotal} />
				<PasswordResult
					password={password}
					placeholder={placeholder}
					onCopy={saveCurrentToHistory}
					onSave={saveNamedToHistory}
					onCopyWithCountdown={startCountdown}
				/>
			</article>
			<article className='bg-slate-800 min-w-48 w-80 p-4 grid grid-cols-1 gap-4 text-xs'>
				<div className='flex items-center justify-between'>
					<span className='text-gray-500 font-bold'>SETTINGS</span>
				</div>
				<div className='flex items-center gap-2 text-xs text-gray-400'>
					<span>Clipboard timeout:</span>
					<select
						value={clipboardTimeout}
						onChange={(e) => setClipboardTimeout(Number(e.target.value))}
						className='bg-slate-900 text-gray-300 px-2 py-1 rounded'
						aria-label='Clipboard timeout'
					>
						<option value={0}>Disabled</option>
						<option value={30}>30s</option>
						<option value={60}>60s</option>
						<option value={120}>2min</option>
						<option value={300}>5min</option>
					</select>
				</div>
				<ModeSelector mode={mode} setMode={setMode} />
				<div className='relative'>
					<div
						className='grid transition-all duration-300 ease-in-out'
						style={{
							gridTemplateRows: mode === 'characters' ? '1fr' : '0fr',
							opacity: mode === 'characters' ? 1 : 0
						}}
					>
						<div className='overflow-hidden'>
							<div className='grid grid-cols-1 gap-4'>
								<PasswordLength length={length} />
								<RangeSlider
									min='4'
									max='64'
									value={length}
									onChange={(e) => setLength(Number(e.target.value))}
									ariaLabel='Password length'
								/>
								<CheckboxLabeled
									label='Include Lowercase Letters'
									checked={includeLowercase}
									onChange={(e) => setIncludeLowercase(e.target.checked)}
									disabled={includeLowercase && isLastCharset}
								/>
								<CheckboxLabeled
									label='Include Uppercase Letters'
									checked={includeUppercase}
									onChange={(e) => setIncludeUppercase(e.target.checked)}
									disabled={includeUppercase && isLastCharset}
								/>
								<CheckboxLabeled
									label='Include Numbers'
									checked={includeNumbers}
									onChange={(e) => setIncludeNumbers(e.target.checked)}
									disabled={includeNumbers && isLastCharset}
								/>
								<CheckboxLabeled
									label='Include Symbols'
									checked={includeSymbols}
									onChange={(e) => setIncludeSymbols(e.target.checked)}
									disabled={includeSymbols && isLastCharset}
								/>
								<CheckboxLabeled
									label='Exclude Ambiguous Characters (0OIl1|)'
									checked={excludeAmbiguous}
									onChange={(e) => setExcludeAmbiguous(e.target.checked)}
								/>
							</div>
						</div>
					</div>
					<div
						className='grid transition-all duration-300 ease-in-out'
						style={{
							gridTemplateRows: mode === 'passphrase' ? '1fr' : '0fr',
							opacity: mode === 'passphrase' ? 1 : 0
						}}
					>
						<div className='overflow-hidden'>
							<PassphraseOptions
								wordCount={wordCount}
								setWordCount={setWordCount}
								separator={separator}
								setSeparator={setSeparator}
								language={language}
								setLanguage={setLanguage}
							/>
						</div>
					</div>
				</div>
				<PasswordStrength entropy={entropy} maxEntropy={maxEntropy} />
				<Button onClick={generatePassword} text={'GENERATE 🡆'} ariaLabel='Generate password' />
			</article>
			<article className='w-80'>
				<PasswordHistory
					history={history}
					historyCollapsed={historyCollapsed}
					setHistoryCollapsed={setHistoryCollapsed}
					clearHistory={clearHistory}
					clearUnnamedHistory={clearUnnamedHistory}
					deleteEntry={deleteEntry}
					renameEntry={renameEntry}
					lastSavedId={lastSavedId}
					clearLastSavedId={clearLastSavedId}
					onCopyWithCountdown={startCountdown}
				/>
			</article>
		</section>
	)
}
