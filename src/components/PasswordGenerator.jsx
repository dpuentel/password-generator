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
import SettingsDialog from './SettingsDialog'
import PermissionDialog from './PermissionDialog'
import { SettingsIcon } from './Icons'
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

	const [showSettingsDialog, setShowSettingsDialog] = useState(false)
	const [tempClipboardTimeout, setTempClipboardTimeout] = useState(0)
	const [countdownRemaining, setCountdownRemaining] = useState(0)
	const [countdownTotal, setCountdownTotal] = useState(0)
	const [clipboardPermissionGranted, setClipboardPermissionGranted] = useState(false)
	const [showPermissionModal, setShowPermissionModal] = useState(false)
	const countdownRef = useRef(null)
	const settingsDialogRef = useRef(null)
	const permissionDialogRef = useRef(null)

	const checkClipboardPermission = async () => {
		if (!navigator.clipboard) return false
		try {
			const result = await navigator.permissions.query({ name: 'clipboard-write' })
			if (result.state !== 'granted') return false
			try {
				await navigator.clipboard.writeText('')
				return true
			} catch {
				return false
			}
		} catch {
			return false
		}
	}

	const checkClipboardPermissionState = async () => {
		if (!navigator.clipboard) return false
		try {
			const result = await navigator.permissions.query({ name: 'clipboard-write' })
			return result.state === 'granted'
		} catch {
			return false
		}
	}

	useEffect(() => {
		checkClipboardPermission().then(setClipboardPermissionGranted)
	}, [])

	useEffect(() => {
		if (showSettingsDialog && settingsDialogRef.current) {
			setTempClipboardTimeout(clipboardTimeout)
			settingsDialogRef.current.showModal()
		}
	}, [showSettingsDialog])

	useEffect(() => {
		if (showPermissionModal && permissionDialogRef.current) {
			permissionDialogRef.current.showModal()
		}
	}, [showPermissionModal])

	const handlePermissionDenied = () => {
		setClipboardPermissionGranted(false)
		setClipboardTimeout(0)
		setShowPermissionModal(true)
	}

	const requestClipboardPermission = async () => {
		if (!navigator.clipboard) return false
		try {
			const result = await navigator.permissions.query({ name: 'clipboard-write' })
			if (result.state === 'granted') {
				setClipboardPermissionGranted(true)
				return true
			}
			if (result.state === 'prompt') {
				await navigator.clipboard.writeText(' ')
				setClipboardPermissionGranted(true)
				return true
			}
			return false
		} catch {
			return false
		}
	}

	const startCountdown = async () => {
		if (clipboardTimeout <= 0) return

		const hasPermission = await checkClipboardPermission()
		if (!hasPermission) {
			handlePermissionDenied()
			return
		}

		if (countdownRef.current) {
			clearInterval(countdownRef.current)
		}

		setCountdownTotal(clipboardTimeout)
		setCountdownRemaining(clipboardTimeout)

		countdownRef.current = setInterval(async () => {
			const stillHasPermission = await checkClipboardPermissionState()
			if (!stillHasPermission) {
				clearInterval(countdownRef.current)
				handlePermissionDenied()
				return
			}

			setCountdownRemaining((prev) => {
				if (prev <= 1) {
					clearInterval(countdownRef.current)
					navigator.clipboard.writeText('').catch(() => {
						handlePermissionDenied()
					})
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

	const handleSettingsCancel = () => {
		if (settingsDialogRef.current) {
			settingsDialogRef.current.close()
		}
		setShowSettingsDialog(false)
	}

	const handleSettingsSave = async () => {
		if (tempClipboardTimeout > 0) {
			const hasPermission = await checkClipboardPermission()
			if (!hasPermission) {
				if (settingsDialogRef.current) {
					settingsDialogRef.current.close()
				}
				setShowSettingsDialog(false)
				setShowPermissionModal(true)
				return
			}
		}
		setClipboardTimeout(tempClipboardTimeout)
		if (settingsDialogRef.current) {
			settingsDialogRef.current.close()
		}
		setShowSettingsDialog(false)
	}

	const handlePermissionClose = () => {
		if (permissionDialogRef.current) {
			permissionDialogRef.current.close()
		}
		setShowPermissionModal(false)
	}

	const handlePermissionAllow = async () => {
		const granted = await requestClipboardPermission()
		if (granted) {
			if (permissionDialogRef.current) {
				permissionDialogRef.current.close()
			}
			setShowPermissionModal(false)
		}
	}

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
					<button
						type='button'
						onClick={() => setShowSettingsDialog(true)}
						className='text-gray-500 hover:text-gray-300 transition-colors duration-150 w-5 h-5'
						aria-label='Open settings'
					>
						<SettingsIcon />
					</button>
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

			<SettingsDialog
				settingsDialogRef={settingsDialogRef}
				clipboardPermissionGranted={clipboardPermissionGranted}
				tempClipboardTimeout={tempClipboardTimeout}
				setTempClipboardTimeout={setTempClipboardTimeout}
				onCancel={handleSettingsCancel}
				onSave={handleSettingsSave}
				onRequestPermission={requestClipboardPermission}
			/>

			<PermissionDialog
				permissionDialogRef={permissionDialogRef}
				onClose={handlePermissionClose}
				onAllowAccess={handlePermissionAllow}
			/>
		</section>
	)
}
