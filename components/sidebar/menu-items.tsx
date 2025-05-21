import { type ReactElement } from 'react';
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';
import ModeToggle from '../mode-toggle';
import Link from 'next/link';

// Menu items.
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
		title: 'Search',
		url: '#',
		icon: Search,
	},
	{
		title: 'Settings',
		url: '#',
		icon: Settings,
	},
];

export default function AppSidebarMenu(): ReactElement {
	return (
		<SidebarGroup>
			<SidebarGroupContent>
				<SidebarMenu>
					{items.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton asChild>
								<Link href={item.url}>
									<item.icon />
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
					<ModeToggle />
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
