
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType: 'Brand' | 'User' | 'Admin';
  userName: string;
}

export function DashboardLayout({ children, userType, userName }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar userType={userType} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader userType={userType} userName={userName} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
