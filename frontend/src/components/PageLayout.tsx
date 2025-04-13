
import { ReactNode } from 'react';
import SideNav from './SideNav';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

const PageLayout = ({ children, className }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      <SideNav />
      <main className={cn("flex-1 ml-16 md:ml-64 p-4 md:p-8", className)}>
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
