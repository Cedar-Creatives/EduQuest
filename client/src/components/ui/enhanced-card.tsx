
import React from 'react';
import { cn } from '@/lib/utils';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'interactive' | 'highlight' | 'success';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const cardVariants = {
  default: 'bg-white border border-gray-200 shadow-md',
  interactive: 'bg-white border border-gray-200 shadow-md hover:shadow-lg hover:border-primary-blue-300 cursor-pointer transition-all duration-250',
  highlight: 'bg-gradient-to-br from-primary-blue-50 to-success-green-50 border border-primary-blue-200',
  success: 'bg-gradient-to-br from-success-green-50 to-success-green-100 border border-success-green-200'
};

const cardSizes = {
  sm: 'p-4 rounded-lg',
  md: 'p-6 rounded-xl',
  lg: 'p-8 rounded-2xl'
};

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  hover = false,
  onClick
}) => {
  const baseClasses = 'relative overflow-hidden transition-all duration-250';
  const variantClasses = cardVariants[variant];
  const sizeClasses = cardSizes[size];
  const hoverClasses = hover ? 'hover:scale-102 hover:shadow-xl' : '';
  const clickableClasses = onClick ? 'cursor-pointer active:scale-98' : '';

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses,
        sizeClasses,
        hoverClasses,
        clickableClasses,
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4', className)}>
    {children}
  </div>
);

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CardTitle: React.FC<CardTitleProps> = ({ 
  children, 
  className, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'text-lg font-semibold',
    md: 'text-xl font-semibold',
    lg: 'text-2xl font-bold'
  };

  return (
    <h3 className={cn(
      'text-gray-900 leading-tight tracking-tight',
      sizeClasses[size],
      className
    )}>
      {children}
    </h3>
  );
};

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ 
  children, 
  className 
}) => (
  <p className={cn('text-gray-600 text-sm leading-relaxed', className)}>
    {children}
  </p>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => (
  <div className={cn('space-y-4', className)}>
    {children}
  </div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => (
  <div className={cn('flex items-center justify-between pt-4 mt-auto', className)}>
    {children}
  </div>
);
