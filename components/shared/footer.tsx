import { APP_NAME } from '@/lib/constants';

export default function Footer() {
	return (
		<footer className='border-t'>
			<div className='container mx-auto py-4'>
				<p className='text-center text-sm text-muted-foreground'>
					© {new Date().getFullYear()} {APP_NAME}. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
