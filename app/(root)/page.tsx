import Logo from '@/public/images/wallet.svg';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
import ModeToggle from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogIn, UserIcon } from 'lucide-react';
const HomePage = async () => {
	return (
		<div className='h-[calc(100vh-58px)] flex items-center justify-center'>
			<div className='glass-panel glow-primary animate-in fade-in zoom-in-95 duration-500 p-8 w-full max-w-md relative'>
				<div className='absolute top-3 right-3'>
					<ModeToggle />
				</div>
				<h1 className='gradient-brand bg-clip-text text-2xl font-semibold text-transparent mb-2 text-center'>
					Welcome to GG!
				</h1>
				<Image
					priority={true}
					src={Logo}
					width={48}
					height={48}
					alt={`${APP_NAME} logo`}
					className='mx-auto w-48 h-40 mb-4'
				/>
				<div className='space-x-2 w-full flex flex-wrap gap-4'>
					<Button variant='default' asChild className='w-full'>
						<Link href='/sign-in'>
							<LogIn className='mr-2' />
							Sign In
						</Link>
					</Button>
					<Button variant='outline' asChild className='w-full'>
						<Link href='/sign-up'>
							<UserIcon className='mr-2' />
							Sign Up
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
