import { useUIStore } from "@/stores/ui-store";
import { Sidebar } from "./Sidebar";
import { MainArea } from "./MainArea";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      {sidebarOpen && <Sidebar />}
      <MainArea>{children}</MainArea>
    </div>
  );
}
