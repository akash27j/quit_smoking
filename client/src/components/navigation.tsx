import { Link, useLocation } from 'wouter';
import { Home, BarChart3, Target, BookOpen, Leaf, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { path: '/journal', icon: BookOpen, label: 'Journal' },
  { path: '/goals', icon: Target, label: 'Goals' },
  { path: '/calm', icon: Leaf, label: 'Calm' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="bg-white shadow-sm border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="grid grid-cols-4 gap-1">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path}>
                <button className={cn(
                  "flex flex-col items-center p-3 rounded-xl transition-colors",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}>
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export function TopNavigation() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Leaf className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">QuitWise</h1>
        </div>
        <Link href="/settings">
          <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </nav>
  );
}
