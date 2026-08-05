'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { PropagateLoader } from 'react-spinners';

export default function Spinner() {
	const [mounted, setMounted] = useState(false);
	const { resolvedTheme } = useTheme();

	// Wait until mounted to avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	const color = !mounted
		? 'white'
		: resolvedTheme === 'dark'
			? 'white'
			: 'black';

	return (
		<PropagateLoader
			color={color}
			loading={true}
			size={15}
			aria-label='Loading Spinner'
			data-testid='loader'
		/>
	);
}
