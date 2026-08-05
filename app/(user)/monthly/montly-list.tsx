import { formatCurrency } from '@/lib/utils/formatHelpers';
import { Transaction } from '@/types/transaction';
import { TransactionOption } from '@/types/transaction-option';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { formatFullDate } from '@/lib/utils/dateHelpers';
import { CardContent } from '@/components/ui/card';
import { updateTransaction } from '@/lib/actions/transaction.actions';
import { toast } from 'sonner';

export default function MonthlyList({
	transactions,
	userPaymentMethods,
	userCreditCardTypes,
	onEditAction,
}: {
	transactions: Transaction[];
	userPaymentMethods: TransactionOption[];
	userCreditCardTypes: TransactionOption[];
	onEditAction: (updatedTransaction: Transaction) => void;
}) {
	const saveTransaction = (updated: Transaction, fieldLabel: string) => {
		onEditAction(updated);
		updateTransaction(updated).then((res) => {
			if (!res.success) {
				toast(`Failed to update ${fieldLabel}`, {
					description: res.message,
				});
			}
		});
	};

	const handlePaymentMethodChange = (tr: Transaction, value: string) => {
		saveTransaction({ ...tr, paymentMethod: value }, 'payment method');
	};

	const handleCreditCardTypeChange = (tr: Transaction, value: string) => {
		saveTransaction({ ...tr, creditCardType: value }, 'credit card type');
	};

	return (
		<CardContent>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Date</TableHead>
						<TableHead>Type</TableHead>
						<TableHead>Category</TableHead>
						<TableHead>Sub Category</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Amount</TableHead>
						<TableHead>Payment Method</TableHead>
						<TableHead>Credit Card Type</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{transactions.map((tr) => {
						const canEditPaymentMethod = tr.type === 'EXPENSE';
						const canEditCreditCardType =
							tr.type === 'EXPENSE' && tr.paymentMethod === 'Credit Card';

						return (
							<TableRow key={tr.id}>
								<TableCell className='py-3'>
									{formatFullDate(tr.transactionDate)}
								</TableCell>
								<TableCell className='py-3'>{tr.type}</TableCell>
								<TableCell className='py-3'>{tr.categoryName}</TableCell>
								<TableCell className='py-3'>{tr.subcategory}</TableCell>
								<TableCell className='py-3'>{tr.description}</TableCell>
								<TableCell className='py-3'>
									{formatCurrency(tr.amount)}
								</TableCell>
								<TableCell className='py-3'>
									{canEditPaymentMethod ? (
										<Select
											value={tr.paymentMethod || undefined}
											onValueChange={(value) =>
												handlePaymentMethodChange(tr, value)
											}>
											<SelectTrigger className='h-8 w-full min-w-[140px]'>
												<SelectValue placeholder='Select' />
											</SelectTrigger>
											<SelectContent>
												{userPaymentMethods.map((option) => (
													<SelectItem key={option.id} value={option.name}>
														{option.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									) : (
										(tr.paymentMethod ?? '—')
									)}
								</TableCell>
								<TableCell className='py-3'>
									{canEditCreditCardType ? (
										<Select
											value={tr.creditCardType || undefined}
											onValueChange={(value) =>
												handleCreditCardTypeChange(tr, value)
											}>
											<SelectTrigger className='h-8 w-full min-w-[140px]'>
												<SelectValue placeholder='Select' />
											</SelectTrigger>
											<SelectContent>
												{userCreditCardTypes.map((option) => (
													<SelectItem key={option.id} value={option.name}>
														{option.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									) : (
										(tr.creditCardType ?? '—')
									)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</CardContent>
	);
}
