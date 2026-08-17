import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import '@/assets/styles/globals.css';
import { APP_NAME, APP_DESCRIPTION, SERVER_URL } from '@/lib/constants';
import { ThemeProvider } from 'next-themes';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';
import { GoogleTagManager } from '@next/third-parties/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import ServiceWorkerRegister from '@/components/service-worker-register';

export const metadata: Metadata = {
	title: {
		template: `%s | ${APP_NAME}`,
		default: APP_NAME,
	},
	description: APP_DESCRIPTION,
	metadataBase: new URL(SERVER_URL),
	manifest: '/manifest.webmanifest',
	icons: {
		icon: '/icons/icon-512.png',
		apple: '/icons/apple-touch-icon.png',
	},
	appleWebApp: {
		capable: true,
		statusBarStyle: 'default',
		title: APP_NAME,
	},
	other: {
		// Next only emits the newer unprefixed "mobile-web-app-capable" from
		// appleWebApp.capable - keep the legacy Apple-prefixed tag too, since
		// that's what older iOS Safari versions actually key standalone
		// launch behavior off of.
		'apple-mobile-web-app-capable': 'yes',
	},
};

export const viewport: Viewport = {
	themeColor: '#6b5b95',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<GoogleTagManager gtmId='GT-K585XPNL' />
			<body className={`${inter.className}`}>
				<ServiceWorkerRegister />
				<SessionProvider>
					<ThemeProvider
						attribute='class'
						defaultTheme='dark'
						enableSystem
						disableTransitionOnChange>
						{children}
						<Toaster />
					</ThemeProvider>
				</SessionProvider>
			</body>
			<GoogleAnalytics gaId='G-XV6GGPE4FB' />
		</html>
	);
}
