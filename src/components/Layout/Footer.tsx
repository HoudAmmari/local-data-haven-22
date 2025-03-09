
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-6 mt-auto border-t border-border/40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
          <span className="text-sm font-medium text-foreground">LocalDataHaven</span>
          <p className="text-xs text-muted-foreground mt-1">
            Your personal data sanctuary
          </p>
        </div>
        
        <div className="flex items-center space-x-6">
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link to="/security" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Security
          </Link>
          <a href="mailto:support@localdatahaven.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
