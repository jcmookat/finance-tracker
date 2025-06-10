import * as LucideIcons from 'lucide-react';
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Gastos at Grasya';
export const APP_DESCRIPTION =
	process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
	'Finance tracker of gastos ni Grasya';
export const SERVER_URL =
	process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const signInDefaultValues = {
	email: '',
	password: '',
};
export const signUpDefaultValues = {
	name: '',
	email: '',
	password: '',
	confirmPassword: '',
};
export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';

export const transactionDefaultValues = () => ({
	userId: '',
	type: 'EXPENSE' as 'EXPENSE' | 'INCOME',
	categoryName: '',
	subCategory: '',
	amount: 100,
	paymentMethod: '',
	creditCardType: '',
	description: '',
	transactionDate: new Date(),
});

export const expensePaymentMethod = [
	{ label: 'Cash', value: 'Cash', icon: LucideIcons.Banknote },
	{ label: 'Credit Card', value: 'Credit Card', icon: LucideIcons.CreditCard },
	{ label: 'Points', value: 'Points', icon: LucideIcons.TicketCheck },
	{
		label: 'Salary Deduction',
		value: 'Salary Deduction',
		icon: LucideIcons.Briefcase,
	},
];

export const expenseCreditCardType = [
	{ label: 'VPASS', value: 'VPASS', icon: LucideIcons.CreditCard },
	{ label: 'UCS', value: 'UCS', icon: LucideIcons.CreditCard },
	{ label: 'RAKUTEN', value: 'RAKUTEN', icon: LucideIcons.CreditCard },
];

export const expenseCategories = [
	{ label: 'Groceries', value: 'Groceries', icon: LucideIcons.ShoppingCart },
	{ label: 'Utilities', value: 'Utilities', icon: LucideIcons.ReceiptText },
	{ label: 'Health', value: 'Health', icon: LucideIcons.HeartPulse },
	{
		label: 'Pinas Account',
		value: 'Pinas Account',
		icon: LucideIcons.PhilippinePeso,
	},
	{ label: 'Subscription', value: 'Subscription', icon: LucideIcons.Podcast },
	{ label: 'Going Out', value: 'Going Out', icon: LucideIcons.MapPlus },
	{ label: 'Wants', value: 'Wants', icon: LucideIcons.ShoppingBag },
	{ label: 'Education', value: 'Education', icon: LucideIcons.GraduationCap },
	{ label: 'Charity', value: 'Charity', icon: LucideIcons.HeartHandshake },
	{ label: 'Moldex', value: 'Moldex', icon: LucideIcons.House },
];

export const expenseSubCategories = [
	{ label: 'Online', value: 'Online', icon: LucideIcons.Router },
	{
		label: 'Gas & Electricity',
		value: 'Gas & Electricity',
		icon: LucideIcons.Zap,
	},
	{ label: 'Water', value: 'Water', icon: LucideIcons.ShowerHead },
	{
		label: 'Drinking Water',
		value: 'Drinking Water',
		icon: LucideIcons.GlassWater,
	},
	{ label: 'Transportation', value: 'Transportation', icon: LucideIcons.Bus },
	{ label: 'Mobile', value: 'Mobile', icon: LucideIcons.Smartphone },
	{ label: 'Internet', value: 'Internet', icon: LucideIcons.Wifi },
	{
		label: 'Health Insurance',
		value: 'Health Insurance',
		icon: LucideIcons.HeartPulse,
	},
	{ label: 'Eating Out', value: 'Eating Out', icon: LucideIcons.ForkKnife },
	{ label: 'Travel', value: 'Travel', icon: LucideIcons.Train },
	{ label: 'House Rent', value: 'House Rent', icon: LucideIcons.House },
	{
		label: 'Bank Transfer',
		value: 'Bank Transfer',
		icon: LucideIcons.BanknoteArrowUp,
	},
	{
		label: 'Bank Transaction Fee',
		value: 'Bank Transaction Fee',
		icon: LucideIcons.BanknoteArrowUp,
	},
	{
		label: 'Income Tax',
		value: 'Income Tax',
		icon: LucideIcons.Briefcase,
	},
	{
		label: 'Residence Tax',
		value: 'Residence Tax',
		icon: LucideIcons.Briefcase,
	},
	{
		label: 'Pension',
		value: 'Pension',
		icon: LucideIcons.Briefcase,
	},
	{
		label: 'Employment Insurance',
		value: 'Employment Insurance',
		icon: LucideIcons.Briefcase,
	},
];

export const incomeCategories = [
	{ label: 'Salary', value: 'Salary', icon: LucideIcons.Briefcase },
	{ label: 'Carry Over', value: 'Carry Over', icon: LucideIcons.Repeat },
	{ label: 'Freelance', value: 'Freelance', icon: LucideIcons.PenTool },
	{ label: 'Bonus', value: 'Bonus', icon: LucideIcons.Coins },
];

export const transactionType = [
	{ label: 'EXPENSE', value: 'EXPENSE', icon: LucideIcons.JapaneseYen },
	{ label: 'INCOME', value: 'INCOME', icon: LucideIcons.Wallet },
];

export const icons: Record<string, LucideIcons.LucideIcon> = {
	ShoppingBag: LucideIcons.ShoppingBag,
	ShoppingCart: LucideIcons.ShoppingCart,
	Train: LucideIcons.Train,
	GraduationCap: LucideIcons.GraduationCap,
	Wallet: LucideIcons.Wallet,
	Briefcase: LucideIcons.Briefcase,
	Repeat: LucideIcons.Repeat,
	PenTool: LucideIcons.PenTool,
	JapaneseYen: LucideIcons.JapaneseYen,
	ReceiptText: LucideIcons.ReceiptText,
	HeartPulse: LucideIcons.HeartPulse,
	PhilippinePeso: LucideIcons.PhilippinePeso,
	Podcast: LucideIcons.Podcast,
	MapPlus: LucideIcons.MapPlus,
	HeartHandshake: LucideIcons.HeartHandshake,
	House: LucideIcons.House,
	Router: LucideIcons.Router,
	Zap: LucideIcons.Zap,
	GlassWater: LucideIcons.GlassWater,
	Bus: LucideIcons.Bus,
	Smartphone: LucideIcons.Smartphone,
	Wifi: LucideIcons.Wifi,
	ForkKnife: LucideIcons.ForkKnife,
	BanknoteArrowUp: LucideIcons.BanknoteArrowUp,
	ShowerHead: LucideIcons.ShowerHead,
	Banknote: LucideIcons.Banknote,
	CreditCard: LucideIcons.CreditCard,
	TicketCheck: LucideIcons.TicketCheck,
	Coins: LucideIcons.Coins,
};
