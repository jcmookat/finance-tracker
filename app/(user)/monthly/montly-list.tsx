import { formatCurrency } from '@/lib/utils/formatHelpers';
import { Transaction } from '@/types/transaction';
import { TransactionOption } from '@/types/transaction-option';
import { Category } from '@/types/category';
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
import { transactionType, expenseSubCategories } from '@/lib/constants';

export default function MonthlyList({
	transactions,
	userCategories,
	userPaymentMethods,
	userCreditCardTypes,
	onEditAction,
}: {
	transactions: Transaction[];
	userCategories: Category[];
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

	const categoriesForType = (type: 'INCOME' | 'EXPENSE') =>
		userCategories
			.filter((c) => c.type === type)
			.slice()
			.sort((a, b) => a.name.localeCompare(b.name));

	const handleTypeChange = (tr: Transaction, value: 'INCOME' | 'EXPENSE') => {
		if (value === tr.type) return;

		const fallbackCategory = categoriesForType(value)[0];

		if (!fallbackCategory) {
			toast('Cannot change type', {
				description: `You don't have any ${value.toLowerCase()} categories yet - add one first.`,
			});
			return;
		}

		toast('Type updated', {
			description: `Category reset to "${fallbackCategory.name}" - update it below if needed.`,
		});

		saveTransaction(
			{
				...tr,
				type: value,
				categoryName: fallbackCategory.name,
				subcategory: undefined,
				paymentMethod: undefined,
				creditCardType: undefined,
			},
			'type',
		);
	};

	const handleCategoryChange = (tr: Transaction, value: string) => {
		saveTransaction({ ...tr, categoryName: value }, 'category');
	};

	const handleSubcategoryChange = (tr: Transaction, value: string) => {
		saveTransaction({ ...tr, subcategory: value }, 'sub category');
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
						const canEditSubcategory = tr.type === 'EXPENSE';

						return (
							<TableRow key={tr.id}>
								<TableCell className='py-3'>
									{formatFullDate(tr.transactionDate)}
								</TableCell>
								<TableCell className='py-3'>
									<Select
										value={tr.type}
										onValueChange={(value) =>
											handleTypeChange(tr, value as 'INCOME' | 'EXPENSE')
										}>
										<SelectTrigger className='h-8 w-full min-w-[110px]'>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{transactionType.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</TableCell>
								<TableCell className='py-3'>
									<Select
										value={tr.categoryName || undefined}
										onValueChange={(value) => handleCategoryChange(tr, value)}>
										<SelectTrigger className='h-8 w-full min-w-[140px]'>
											<SelectValue placeholder='Select' />
										</SelectTrigger>
										<SelectContent>
											{categoriesForType(tr.type).map((category) => (
												<SelectItem key={category.id} value={category.name}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</TableCell>
								<TableCell className='py-3'>
									{canEditSubcategory ? (
										<Select
											value={tr.subcategory || undefined}
											onValueChange={(value) =>
												handleSubcategoryChange(tr, value)
											}>
											<SelectTrigger className='h-8 w-full min-w-[140px]'>
												<SelectValue placeholder='Select' />
											</SelectTrigger>
											<SelectContent>
												{expenseSubCategories.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									) : (
										(tr.subcategory ?? '—')
									)}
								</TableCell>
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
