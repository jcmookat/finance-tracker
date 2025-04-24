import { auth } from '@/auth';
import { type ReactElement } from 'react';

export default async function DashboardPage(): Promise<ReactElement> {
  const session = await auth();
  return <>Dashboaard</>;
}
