import {
	ShoppingBag,
	ShoppingCart,
	Train,
	GraduationCap,
	Wallet,
	Briefcase,
	Repeat,
	PenTool,
	JapaneseYen,
	ReceiptText,
	HeartPulse,
	PhilippinePeso,
	Podcast,
	MapPlus,
	HeartHandshake,
	House,
	Router,
	Zap,
	GlassWater,
	Bus,
	Smartphone,
	Wifi,
	ForkKnife,
	BanknoteArrowUp,
	ShowerHead,
	Banknote,
	CreditCard,
	LucideIcon,
} from 'lucide-react';
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
	{ label: 'Cash', value: 'Cash', icon: Banknote },
	{ label: 'Credit Card', value: 'Credit Card', icon: CreditCard },
];

export const expenseCreditCardType = [
	{ label: 'VPASS', value: 'VPASS', icon: CreditCard },
	{ label: 'UCS', value: 'UCS', icon: CreditCard },
	{ label: 'RAKUTEN', value: 'RAKUTEN', icon: CreditCard },
];

export const expenseCategories = [
	{ label: 'Groceries', value: 'Groceries', icon: ShoppingCart },
	{ label: 'Utilities', value: 'Utilities', icon: ReceiptText },
	{ label: 'Health', value: 'Health', icon: HeartPulse },
	{ label: 'Pinas Account', value: 'Pinas Account', icon: PhilippinePeso },
	{ label: 'Subscription', value: 'Subscription', icon: Podcast },
	{ label: 'Going Out', value: 'Going Out', icon: MapPlus },
	{ label: 'Wants', value: 'Wants', icon: ShoppingBag },
	{ label: 'Education', value: 'Education', icon: GraduationCap },
	{ label: 'Charity', value: 'Charity', icon: HeartHandshake },
	{ label: 'Moldex', value: 'Moldex', icon: House },
];

export const expenseSubCategories = [
	{ label: 'Online', value: 'Online', icon: Router },
	{ label: 'Gas & Electricity', value: 'Gas & Electricity', icon: Zap },
	{ label: 'Water', value: 'Water', icon: ShowerHead },
	{ label: 'Drinking Water', value: 'Drinking Water', icon: GlassWater },
	{ label: 'Transportation', value: 'Transportation', icon: Bus },
	{ label: 'Mobile', value: 'Mobile', icon: Smartphone },
	{ label: 'Internet', value: 'Internet', icon: Wifi },
	{ label: 'Health Insurance', value: 'Health Insurance', icon: HeartPulse },
	{ label: 'Eating Out', value: 'Eating Out', icon: ForkKnife },
	{ label: 'Travel', value: 'Travel', icon: Train },
	{ label: 'House Rent', value: 'House Rent', icon: House },
	{ label: 'Bank Transfer ', value: 'Bank Transfer', icon: BanknoteArrowUp },
];

export const incomeCategories = [
	{ label: 'Salary', value: 'Salary', icon: Briefcase },
	{ label: 'Carry Over', value: 'Carry Over', icon: Repeat },
	{ label: 'Freelance', value: 'Freelance', icon: PenTool },
];

export const transactionType = [
	{ label: 'EXPENSE', value: 'EXPENSE', icon: JapaneseYen },
	{ label: 'INCOME', value: 'INCOME', icon: Wallet },
];

export const categoryIconMap: Record<string, React.ElementType> = {
	Groceries: ShoppingCart,
	Utilities: ReceiptText,
	Health: HeartPulse,
	'Pinas Account': PhilippinePeso,
	Subscription: Podcast,
	'Going Out': MapPlus,
	Wants: ShoppingBag,
	Education: GraduationCap,
	Charity: HeartHandshake,
	Moldex: House,
	Online: Router,
	'Gas & Electricity': Zap,
	Water: ShowerHead,
	'Drinking Water': GlassWater,
	Transportation: Bus,
	Mobile: Smartphone,
	Internet: Wifi,
	'Health Insurance': HeartPulse,
	'Eating Out': ForkKnife,
	Travel: Train,
	'House Rent': House,
	'Bank Transfer': BanknoteArrowUp,
	Salary: Briefcase,
	'Carry Over': Repeat,
	Freelance: PenTool,
};

export const iconMap: Record<string, LucideIcon> = {
	ShoppingBag,
	ShoppingCart,
	Train,
	GraduationCap,
	Wallet,
	Briefcase,
	Repeat,
	PenTool,
	JapaneseYen,
	ReceiptText,
	HeartPulse,
	PhilippinePeso,
	Podcast,
	MapPlus,
	HeartHandshake,
	House,
	Router,
	Zap,
	GlassWater,
	Bus,
	Smartphone,
	Wifi,
	ForkKnife,
	BanknoteArrowUp,
	ShowerHead,
	Banknote,
	CreditCard,
};
