import ModeToggle from '@/components/mode-toggle';
import Link from 'next/link';

const SettingsPage = () => {
	return (
		<div>
			<h2>Theme</h2>
			<ModeToggle />
			<div>
				<Link href='https://www.facebook.com/mookatph'>
					Test link to facebook
				</Link>
			</div>
		</div>
	);
};

export default SettingsPage;
