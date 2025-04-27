import Image from 'next/image';
import Link from 'next/link';
import Logo from '@/public/images/wallet.svg';
import { APP_NAME } from '@/lib/constants';
import ModeToggle from '../mode-toggle';

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              priority={true}
              src={Logo}
              width={48}
              height={48}
              alt={`${APP_NAME} logo`}
            />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className="space-x-2 flex ">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
