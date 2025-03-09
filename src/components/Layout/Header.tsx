
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FileText, HardDrive, Home, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: <Home className="h-4 w-4 mr-2" /> },
    { label: 'Dashboard', path: '/dashboard', icon: <HardDrive className="h-4 w-4 mr-2" /> },
    { label: 'Files', path: '/files', icon: <FileText className="h-4 w-4 mr-2" /> },
    { label: 'Settings', path: '/settings', icon: <Settings className="h-4 w-4 mr-2" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 py-4',
        scrolled ? 'glass shadow-subtle' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
        >
          <span className="text-2xl font-semibold tracking-tight">LocalData<span className="text-primary">Haven</span></span>
        </Link>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "default" : "ghost"}
              size="sm"
              asChild
              className={cn(
                "transition-all duration-300 rounded-full px-4",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Link to={item.path} className="flex items-center">
                {item.icon}
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
