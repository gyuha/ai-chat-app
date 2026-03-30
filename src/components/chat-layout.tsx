import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { useUIStore } from "@/stores/ui-store"

interface ChatLayoutProps {
  children: React.ReactNode  // Main content (chat area)
  header?: React.ReactNode    // Optional custom header
}

export function ChatLayout({ children, header }: ChatLayoutProps) {
  const { sidebarOpen, setSidebarOpen, closeSidebar } = useUIStore()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar: always visible at lg+ (1024px) */}
      <div className="hidden lg:flex lg:flex-col lg:w-[260px] lg:shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar: shown via overlay when open */}
      {sidebarOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
          {/* Sidebar panel */}
          <div className="fixed inset-y-0 left-0 z-50 w-[260px] lg:hidden">
            <Sidebar onClose={closeSidebar} />
          </div>
        </>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header with hamburger */}
        <header className="flex items-center h-14 px-4 border-b bg-background/95 backdrop-blur lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="h-9 w-9"
          >
            <Menu className="h-5 w-5" />
          </Button>
          {header && <div className="ml-3">{header}</div>}
        </header>

        {/* Desktop header space (placeholder for alignment) */}
        <div className="hidden lg:block lg:h-14 lg:border-b lg:bg-background/95 lg:backdrop-blur" />

        {/* Page content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
