
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  BookOpenIcon, 
  AcademicCapIcon, 
  UserIcon,
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';
import {
  HomeIcon as HomeIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  UserIcon as UserIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid
} from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSolid: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Home',
    href: '/dashboard',
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
  },
  {
    name: 'Notes',
    href: '/notes',
    icon: BookOpenIcon,
    iconSolid: BookOpenIconSolid,
  },
  {
    name: 'Quiz',
    href: '/quiz',
    icon: AcademicCapIcon,
    iconSolid: AcademicCapIconSolid,
  },
  {
    name: 'AI Teacher',
    href: '/ai-teacher',
    icon: ChatBubbleLeftRightIcon,
    iconSolid: ChatBubbleLeftRightIconSolid,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: UserIcon,
    iconSolid: UserIconSolid,
  },
];

export const MobileNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 pb-safe-area-inset-bottom">
      <div className="flex items-center justify-around py-2">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.href || 
                          (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
          const Icon = isActive ? item.iconSolid : item.icon;
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200',
                'min-w-[44px] min-h-[44px]', // Touch target
                'hover:bg-gray-50 active:bg-gray-100',
                isActive 
                  ? 'text-primary-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className={cn(
                'text-xs font-medium leading-none',
                isActive ? 'text-primary-blue-600' : 'text-gray-500'
              )}>
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

// Floating Action Button for AI Teacher (when not on AI Teacher page)
export const AITeacherFAB: React.FC = () => {
  const location = useLocation();
  const isOnAITeacher = location.pathname === '/ai-teacher';
  
  if (isOnAITeacher) return null;
  
  return (
    <NavLink
      to="/ai-teacher"
      className={cn(
        'fixed bottom-20 right-4 z-40',
        'w-14 h-14 bg-success-green-500 rounded-full',
        'flex items-center justify-center',
        'shadow-lg hover:shadow-xl',
        'transform transition-all duration-200',
        'hover:scale-110 active:scale-95',
        'text-white'
      )}
    >
      <ChatBubbleLeftRightIconSolid className="w-6 h-6" />
    </NavLink>
  );
};
