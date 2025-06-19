'use client';
import ModeToggle from '@/components/mode-toggle';
import Link from 'next/link';
import { sendGTMEvent } from '@next/third-parties/google';
import { sendGAEvent } from '@next/third-parties/google';
import { Button } from '@/components/ui/button';

const SettingsPage = () => {
	return (
		<div>
			<h2>Theme</h2>
			<ModeToggle />
			<div className='mb-4'>
				<Link href='https://www.facebook.com/mookatph'>
					Test link to facebook
				</Link>
			</div>
			<div className='mb-4'>
				<Button
					onClick={() =>
						sendGTMEvent({ event: 'buttonClicked', value: 'xyz' })
					}>
					Send Event GTM
				</Button>
			</div>
			<div>
				<Button
					onClick={() =>
						sendGAEvent('event', 'buttonClicked', { value: 'xyz' })
					}>
					Send Event GA
				</Button>
			</div>
		</div>
	);
};

export default SettingsPage;
