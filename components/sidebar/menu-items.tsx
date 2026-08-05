'use client';

import { type ReactElement } from 'react';
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import { Calendar, Home, Inbox } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
	{
		title: 'Dashboard',
		url: '/dashboard',
		icon: Home,
	},
	{
		title: 'Transactions',
		url: '/transactions',
		icon: Inbox,
	},
	{
		title: 'Monthly Reports',
		url: '/monthly',
		icon: Calendar,
	},
	{
		title: 'Annual Reports',
		url: '/annual',
		icon: Calendar,
	},
	{
		title: 'All Reports',
		url: '/reports',
		icon: Calendar,
	},
	{
		title: 'Manage',
		url: '/categories',
		icon: Inbox,
	},
];

export default function AppSidebarMenu(): ReactElement {
	const pathname = usePathname();
	const { isMobile, setOpenMobile } = useSidebar();

	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => {
						const isActive =
							pathname === item.url || pathname.startsWith(`${item.url}/`);

						return (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton asChild isActive={isActive}>
									<Link
										href={item.url}
										onClick={() => {
											if (isMobile) setOpenMobile(false);
										}}>
										<item.icon />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						);
					})}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
