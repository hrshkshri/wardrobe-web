import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/auth.service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/auth/login');
  };

  const getAvatarInitials = (name?: string) => {
    return (
      name
        ?.split(' ')
        .map((word) => word[0])
        .join('')
        .toUpperCase() || 'U'
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <header className="border-b px-4 py-3 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">Wardrobe</h1>
          <Input type="text" placeholder="Quick search..." className="w-64" />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>{getAvatarInitials(user?.name)}</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
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
              Wardrobe
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Analytics
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Settings
            </Button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
