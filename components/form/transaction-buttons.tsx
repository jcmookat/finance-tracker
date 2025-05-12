'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { JapaneseYen, Wallet } from 'lucide-react';

export default function CreateTransactionButtons() {
  const router = useRouter();

  return (
    <div className="flex gap-4">
      <Button onClick={() => router.push('/transactions/create?type=EXPENSE')}>
        <JapaneseYen />
        Add Expense
      </Button>
      <Button
        onClick={() => router.push('/transactions/create?type=INCOME')}
        variant="secondary"
      >
        <Wallet />
        Add Income
      </Button>
    </div>
  );
}
