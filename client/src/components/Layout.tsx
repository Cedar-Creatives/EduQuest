import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { MobileNavigation, AITeacherFAB } from './MobileNavigation';
import { OfflineIndicator, ConnectionStatus } from './OfflineIndicator';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const Layout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Don't show mobile nav on landing, login, or register pages
  const showMobileNav = user && !['/login', '/register', '/'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-green-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className={cn(
          'flex-1 p-4 sm:p-6',
          showMobileNav ? 'pb-20' : 'pb-6' // Add bottom padding for mobile nav
        )}>
          <Outlet />
        </main>
      </div>

      {/* Desktop Footer */}
      <div className="hidden lg:block">
        <Footer />
      </div>

      {/* Mobile Navigation */}
      {showMobileNav && <MobileNavigation />}

      {/* AI Teacher FAB */}
      {showMobileNav && <AITeacherFAB />}

      {/* Offline Indicator */}
      <OfflineIndicator />
      
      {/* Connection Status */}
      <ConnectionStatus />
    </div>
  );
};

export default Layout;