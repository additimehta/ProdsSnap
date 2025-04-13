
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Package, 
  Clock, 
  Plus, 
  Settings, 
  ChevronRight, 
  ChevronLeft,
  ShoppingCart,
  LineChart,
  Home
} from "lucide-react";
import { getCurrentUser } from '@/data/mockData';

const SideNav = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const user = getCurrentUser();
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Package, label: 'Products', path: '/products' },
    { icon: Clock, label: 'Version History', path: '/versions' },
    { icon: ShoppingCart, label: 'Orders', path: '/orders' },
    { icon: LineChart, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div 
      className={cn(
        "h-screen fixed left-0 top-0 z-40 flex flex-col border-r bg-sidebar shadow-sm transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">ProdSnap</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/" className="mx-auto">
            <ShoppingCart className="h-6 w-6 text-primary" />
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto" 
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-sidebar-accent",
                location.pathname === item.path ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("h-5 w-5", location.pathname === item.path ? "text-primary" : "")} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t p-4">
        <Button 
          variant="outline" 
          size={collapsed ? "icon" : "default"} 
          className="w-full justify-start gap-2 bg-sidebar-accent hover:bg-sidebar-accent/80"
          asChild
        >
          <Link to="/products/new">
            <Plus className="h-4 w-4" />
            {!collapsed && <span>Add Product</span>}
          </Link>
        </Button>
      </div>
      
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
            {user.name.charAt(0)}
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideNav;
