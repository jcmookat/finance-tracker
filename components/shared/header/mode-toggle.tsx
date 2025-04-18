'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

const ModeToggle = () => {
	const [mounted, setMounted] = useState<boolean>(false);
	const { theme, setTheme } = useTheme();
	useEffect(() => {
		setMounted(true);
	}, []);
	if (!mounted) {
		return null;
	}

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	return (
		<Button
			variant='ghost'
			size='icon'
			onClick={toggleTheme}
			className='relative overflow-hidden focus-visible:ring-0 focus-visible:ring-offset-0 h-10 w-10'
			aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
			<AnimatePresence mode='wait' initial={false}>
				<motion.div
					key={theme}
					initial={{ y: -20, opacity: 0, rotate: -90 }}
					animate={{ y: 0, opacity: 1, rotate: 0 }}
					exit={{ y: 20, opacity: 0, rotate: 90 }}
					transition={{ duration: 0.3 }}
					className='absolute inset-0 flex items-center justify-center'>
					{theme === 'dark' ? (
						<SunIcon className='h-5 w-5' />
					) : (
						<MoonIcon className='h-5 w-5' />
					)}
				</motion.div>
			</AnimatePresence>
		</Button>
	);
};

export default ModeToggle;
