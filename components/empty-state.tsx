import Image from 'next/image';
import logo from '@/public/images/wallet.svg';

export default function EmptyState({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <Image src={logo} alt="" width={80} height={80} className="mb-4" />
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
