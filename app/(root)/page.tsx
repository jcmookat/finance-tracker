import Logo from '@/public/images/wallet.svg';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';
const HomePage = async () => {
	return (
		<div className='h-[calc(100vh-134px)] flex items-center justify-center'>
			<div className='p-8 rounded-lg shadow-lg w-full max-w-md'>
				<Image
					priority={true}
					src={Logo}
					width={48}
					height={48}
					alt={`${APP_NAME} logo`}
					className='mx-auto w-24 h-24 mb-4'
				/>
				<h1 className='text-2xl font-semibold mb-4 text-center'>
					Welcome to GG!
				</h1>
			</div>
		</div>
	);
};

export default HomePage;
