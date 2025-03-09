
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu,
  X, 
  Home, 
  LayoutDashboard, 
  FolderClosed, 
  Settings,
  Database
} from 'lucide-react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link to="/" className="flex items-center">
          <div className="bg-primary text-primary-foreground p-1 rounded mr-2 flex items-center justify-center">
            <Database className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl">LocalDataHaven</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-1">
          <Button 
            variant={isActive('/') ? "secondary" : "ghost"} 
            asChild 
            size="sm"
          >
            <Link to="/" className="flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
          
          <Button 
            variant={isActive('/dashboard') ? "secondary" : "ghost"} 
            asChild 
            size="sm"
          >
            <Link to="/dashboard" className="flex items-center">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
          
          <Button 
            variant={isActive('/files') ? "secondary" : "ghost"} 
            asChild 
            size="sm"
          >
            <Link to="/files" className="flex items-center">
              <FolderClosed className="h-4 w-4 mr-2" />
              Files
            </Link>
          </Button>
          
          <Button 
            variant={isActive('/api') ? "secondary" : "ghost"} 
            asChild 
            size="sm"
          >
            <Link to="/api" className="flex items-center">
              <Database className="h-4 w-4 mr-2" />
              API
            </Link>
          </Button>
          
          <Button 
            variant={isActive('/settings') ? "secondary" : "ghost"} 
            asChild 
            size="sm"
          >
            <Link to="/settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>
        </nav>
        
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-4 space-y-2">
            <Button 
              variant={isActive('/') ? "secondary" : "ghost"} 
              asChild 
              className="justify-start"
              onClick={closeMobileMenu}
            >
              <Link to="/" className="flex items-center">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Link>
            </Button>
            
            <Button 
              variant={isActive('/dashboard') ? "secondary" : "ghost"} 
              asChild 
              className="justify-start"
              onClick={closeMobileMenu}
            >
              <Link to="/dashboard" className="flex items-center">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            
            <Button 
              variant={isActive('/files') ? "secondary" : "ghost"} 
              asChild 
              className="justify-start"
              onClick={closeMobileMenu}
            >
              <Link to="/files" className="flex items-center">
                <FolderClosed className="h-4 w-4 mr-2" />
                Files
              </Link>
            </Button>
            
            <Button 
              variant={isActive('/api') ? "secondary" : "ghost"} 
              asChild 
              className="justify-start"
              onClick={closeMobileMenu}
            >
              <Link to="/api" className="flex items-center">
                <Database className="h-4 w-4 mr-2" />
                API
              </Link>
            </Button>
            
            <Button 
              variant={isActive('/settings') ? "secondary" : "ghost"} 
              asChild 
              className="justify-start"
              onClick={closeMobileMenu}
            >
              <Link to="/settings" className="flex items-center">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
