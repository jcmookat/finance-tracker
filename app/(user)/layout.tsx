import { SessionProvider } from 'next-auth/react';
import AppSidebar from '@/components/sidebar';
import AppBreadcrumb from '@/components/sidebar/breadcrumb';
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar';
import { Metadata } from 'next';
import { APP_DESCRIPTION, APP_NAME, SERVER_URL } from '@/lib/constants';

export const metadata: Metadata = {
	title: {
		template: `%s | ${APP_NAME}`,
		default: APP_NAME,
	},
	description: APP_DESCRIPTION,
	metadataBase: new URL(SERVER_URL),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SessionProvider>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
						<div className='flex items-center gap-2 px-4'>
							<SidebarTrigger className='-ml-1' />
							<AppBreadcrumb />
						</div>
					</header>
					<main className='flex-1 p-4 pt-0 pb-12'>
						<div className='min-h-[calc(100vh-80px)] flex-1 rounded-xl'>
							{children}
						</div>
					</main>
				</SidebarInset>
			</SidebarProvider>
		</SessionProvider>
	);
}
