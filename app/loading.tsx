'use client';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { PropagateLoader } from 'react-spinners';

const Loading = () => {
	const [mounted, setMounted] = useState(false);
	const { resolvedTheme } = useTheme();

	// Wait until mounted to avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	// Set color based on theme
	const color = !mounted
		? 'white'
		: resolvedTheme === 'dark'
		? 'white'
		: 'black';

	return (
		<div className='flex flex-col items-center justify-center min-h-screen'>
			<PropagateLoader
				color={color}
				loading={true}
				size={15}
				aria-label='Loading Spinner'
				data-testid='loader'
			/>
		</div>
	);
};

export default Loading;
