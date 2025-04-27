import { type ReactElement } from 'react';
import { ArrowUpCircleIcon, Wallet } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import AppSidebarMenu from './menu-items';
import AppSidebarFooter from './footer';
import { auth } from '@/auth';
import { APP_NAME } from '@/lib/constants';

export default async function AppSidebar(): Promise<ReactElement> {
  const session = await auth();
  if (!session) {
    throw new Error('User is not authenticated');
  }

  const user = session.user;
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:!p-1.5"
              >
                <Link href="/">
                  <Wallet className="h-5 w-5" />
                  <span className="text-base font-semibold">{APP_NAME}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <AppSidebarMenu />
      </SidebarContent>
      <AppSidebarFooter user={user} />
    </Sidebar>
  );
}
