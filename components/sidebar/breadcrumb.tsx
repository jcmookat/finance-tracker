'use client';
import { usePathname } from 'next/navigation';
import { type ReactElement } from 'react';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';

const routeTitles: Record<string, string> = {
	'/dashboard': 'Dashboard',
	'/transactions': 'Transactions',
	'/monthly': 'Monthly Reports',
	'/annual': 'Annual Reports',
	'/reports': 'All Reports',
	'/categories': 'Categories',
	'/settings': 'Settings',
	// Add other routes as needed
	// Example for a dynamic route, though more complex in practice:
	// '/users/[id]': 'User Details', // This would need to be resolved dynamically
};

export default function AppBreadcrumb(): ReactElement {
	const pathname = usePathname();
	const currentTitle = routeTitles[pathname] || 'Page';

	return (
		<>
			<Separator orientation='vertical' className='mr-2 h-4' />
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbPage>{currentTitle}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</>
	);
}
