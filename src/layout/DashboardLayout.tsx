import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <header className="border-b px-4 py-2 flex items-center justify-between bg-white">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Test User</h1>
          <Input type="text" placeholder="Quick search" className="w-64" />
        </div>
        <div className="flex items-center space-x-4">
          <Avatar>
            {/* Replace the image URL below with your user’s avatar URL */}
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>TU</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content: Sidebar + Page Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white">
          <nav className="p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              User
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Scan Environment
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Settings
            </Button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
