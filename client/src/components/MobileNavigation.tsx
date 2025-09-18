import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  AcademicCapIcon as AcademicCapIconSolid,
  UserIcon as UserIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
} from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  iconSolid: React.ComponentType<{ className?: string }>;
}

const navigationItems: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/app",
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
  },
  {
    name: "Notes",
    href: "/app/notes",
    icon: BookOpenIcon,
    iconSolid: BookOpenIconSolid,
  },
  {
    name: "Quiz",
    href: "/app/quiz",
    icon: AcademicCapIcon,
    iconSolid: AcademicCapIconSolid,
  },
  {
    name: "AI Teacher",
    href: "/app/ai-teacher",
    icon: ChatBubbleLeftRightIcon,
    iconSolid: ChatBubbleLeftRightIconSolid,
  },
  {
    name: "Profile",
    href: "/app/profile",
    icon: UserIcon,
    iconSolid: UserIconSolid,
  },
];

export const MobileNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 px-4 pb-safe-area-inset-bottom">
      <div className="flex items-center justify-around py-2">
        {navigationItems.map((item) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/app" &&
              location.pathname.startsWith(item.href));
          const Icon = isActive ? item.iconSolid : item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200",
                "min-w-[44px] min-h-[44px]", // Touch target
                "hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700",
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span
                className={cn(
                  "text-xs font-medium leading-none",
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                )}
              >
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
  const isOnAITeacher = location.pathname === "/app/ai-teacher";

  if (isOnAITeacher) return null;

  return (
    <NavLink
      to="/app/ai-teacher"
      className={cn(
        "fixed bottom-20 right-4 z-40",
        "w-14 h-14 bg-success-green-500 rounded-full",
        "flex items-center justify-center",
        "shadow-lg hover:shadow-xl",
        "transform transition-all duration-200",
        "hover:scale-110 active:scale-95",
        "text-white"
      )}
    >
      <ChatBubbleLeftRightIconSolid className="w-6 h-6" />
    </NavLink>
  );
};
