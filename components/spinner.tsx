import Image from 'next/image';
import logo from '@/public/images/wallet.svg';

export default function Spinner() {
	return (
		<div className="flex flex-col items-center gap-4">
			<Image
				src={logo}
				alt="Loading"
				width={72}
				height={72}
				priority
				className="animate-mascot-bounce"
			/>
			<div className="flex gap-1.5">
				<span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
				<span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
				<span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
			</div>
		</div>
	);
}
