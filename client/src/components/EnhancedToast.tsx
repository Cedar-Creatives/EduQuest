import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { CheckCircle, AlertTriangle, XCircle, Info, Zap, Trophy, BookOpen, Brain } from 'lucide-react';

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Enhanced toast with better styling and icons
export const toast = {
  success: (message: string, options?: ToastOptions) => {
    sonnerToast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: <CheckCircle className="w-4 h-4" />,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      className: 'bg-green-50 border-green-200 text-green-800',
    });
  },

  error: (message: string, options?: ToastOptions) => {
    sonnerToast.error(message, {
      description: options?.description,
      duration: options?.duration || 6000,
      icon: <XCircle className="w-4 h-4" />,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      className: 'bg-red-50 border-red-200 text-red-800',
    });
  },

  warning: (message: string, options?: ToastOptions) => {
    sonnerToast.warning(message, {
      description: options?.description,
      duration: options?.duration || 5000,
      icon: <AlertTriangle className="w-4 h-4" />,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    });
  },

  info: (message: string, options?: ToastOptions) => {
    sonnerToast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
      icon: <Info className="w-4 h-4" />,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick,
      } : undefined,
      className: 'bg-blue-50 border-blue-200 text-blue-800',
    });
  },

  // Custom themed toasts for EduQuest
  quiz: {
    started: (subject: string) => {
      sonnerToast.success(`${subject} quiz started!`, {
        description: 'Good luck! Take your time and think carefully.',
        icon: <BookOpen className="w-4 h-4" />,
        duration: 3000,
        className: 'bg-blue-50 border-blue-200 text-blue-800',
      });
    },

    completed: (score: number, total: number) => {
      const percentage = Math.round((score / total) * 100);
      const isGoodScore = percentage >= 70;
      
      sonnerToast.success(`Quiz completed! ${score}/${total} (${percentage}%)`, {
        description: isGoodScore ? 'Great job! Keep up the excellent work!' : 'Good effort! Review the explanations to improve.',
        icon: isGoodScore ? <Trophy className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />,
        duration: 5000,
        className: isGoodScore ? 'bg-green-50 border-green-200 text-green-800' : 'bg-blue-50 border-blue-200 text-blue-800',
      });
    },

    saved: () => {
      sonnerToast.info('Progress saved', {
        description: 'Your quiz progress has been saved automatically.',
        icon: <CheckCircle className="w-4 h-4" />,
        duration: 2000,
        className: 'bg-gray-50 border-gray-200 text-gray-800',
      });
    },
  },

  ai: {
    thinking: () => {
      sonnerToast.loading('AI is thinking...', {
        description: 'Generating a helpful response for you.',
        icon: <Brain className="w-4 h-4 animate-pulse" />,
        duration: Infinity, // Will be dismissed manually
        className: 'bg-purple-50 border-purple-200 text-purple-800',
      });
    },

    response: () => {
      sonnerToast.success('AI response ready!', {
        description: 'Your AI teacher has provided a helpful answer.',
        icon: <Brain className="w-4 h-4" />,
        duration: 3000,
        className: 'bg-purple-50 border-purple-200 text-purple-800',
      });
    },

    error: () => {
      sonnerToast.error('AI temporarily unavailable', {
        description: 'Using fallback responses. Full AI features will return soon.',
        icon: <Brain className="w-4 h-4" />,
        duration: 4000,
        className: 'bg-orange-50 border-orange-200 text-orange-800',
      });
    },
  },

  offline: {
    detected: () => {
      sonnerToast.warning('You\'re now offline', {
        description: 'Some features may be limited. Your progress is saved locally.',
        icon: <AlertTriangle className="w-4 h-4" />,
        duration: 5000,
        className: 'bg-orange-50 border-orange-200 text-orange-800',
      });
    },

    reconnected: () => {
      sonnerToast.success('Back online!', {
        description: 'All features are now available. Syncing your progress...',
        icon: <CheckCircle className="w-4 h-4" />,
        duration: 3000,
        className: 'bg-green-50 border-green-200 text-green-800',
      });
    },
  },

  achievement: {
    unlocked: (title: string, description: string) => {
      sonnerToast.success(`Achievement Unlocked: ${title}`, {
        description: description,
        icon: <Trophy className="w-4 h-4" />,
        duration: 6000,
        className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        action: {
          label: 'View All',
          onClick: () => {
            // Navigate to achievements page
            window.location.href = '/app?tab=achievements';
          },
        },
      });
    },

    progress: (title: string, current: number, total: number) => {
      const percentage = Math.round((current / total) * 100);
      sonnerToast.info(`${title} Progress: ${percentage}%`, {
        description: `${current}/${total} completed. Keep going!`,
        icon: <Zap className="w-4 h-4" />,
        duration: 4000,
        className: 'bg-blue-50 border-blue-200 text-blue-800',
      });
    },
  },

  // Utility functions
  dismiss: (id?: string | number) => {
    sonnerToast.dismiss(id);
  },

  dismissAll: () => {
    sonnerToast.dismiss();
  },

  promise: <T,>(
    promise: Promise<T>,
    {
      loading,
      success,
      error,
    }: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return sonnerToast.promise(promise, {
      loading,
      success,
      error,
    });
  },
};

// Hook for using enhanced toast
export function useEnhancedToast() {
  return toast;
}