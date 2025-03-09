
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface PageLayoutProps {
  children: ReactNode;
  fullWidth?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  fullWidth = false 
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-1 pt-24 px-4 ${fullWidth ? '' : 'max-w-7xl mx-auto'} w-full animate-fade-in`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
