import { toast as sonnerToast } from "sonner";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

export interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  cancel?: {
    label: string;
    onClick?: () => void;
  };
}

const toastStyles = {
  success: {
    icon: CheckCircle,
    className: "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
    iconClassName: "text-green-600 dark:text-green-400"
  },
  error: {
    icon: XCircle,
    className: "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
    iconClassName: "text-red-600 dark:text-red-400"
  },
  warning: {
    icon: AlertCircle,
    className: "border-yellow-200 bg-yellow-50 text-yellow-900 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-100",
    iconClassName: "text-yellow-600 dark:text-yellow-400"
  },
  info: {
    icon: Info,
    className: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100",
    iconClassName: "text-blue-600 dark:text-blue-400"
  }
};

function createToast(type: keyof typeof toastStyles, message: string, options?: ToastOptions) {
  const style = toastStyles[type];
  const Icon = style.icon;

  return sonnerToast.custom((t) => (
    <div className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md ${style.className}`}>
      <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${style.iconClassName}`} />
      <div className="flex-1 min-w-0">
        {options?.title && (
          <div className="font-semibold text-sm mb-1">{options.title}</div>
        )}
        <div className="text-sm">{message}</div>
        {options?.description && (
          <div className="text-xs mt-1 opacity-80">{options.description}</div>
        )}
        {(options?.action || options?.cancel) && (
          <div className="flex gap-2 mt-3">
            {options.action && (
              <button
                onClick={() => {
                  options.action?.onClick();
                  sonnerToast.dismiss(t);
                }}
                className="text-xs font-medium px-2 py-1 rounded bg-current/10 hover:bg-current/20 transition-colors"
              >
                {options.action.label}
              </button>
            )}
            {options.cancel && (
              <button
                onClick={() => {
                  options.cancel?.onClick?.();
                  sonnerToast.dismiss(t);
                }}
                className="text-xs font-medium px-2 py-1 rounded opacity-60 hover:opacity-80 transition-opacity"
              >
                {options.cancel.label}
              </button>
            )}
          </div>
        )}
      </div>
      <button
        onClick={() => sonnerToast.dismiss(t)}
        className="flex-shrink-0 opacity-60 hover:opacity-80 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  ), {
    duration: options?.duration || 4000,
    position: "top-right",
  });
}

export const toast = {
  success: (message: string, options?: ToastOptions) => createToast("success", message, options),
  error: (message: string, options?: ToastOptions) => createToast("error", message, options),
  warning: (message: string, options?: ToastOptions) => createToast("warning", message, options),
  info: (message: string, options?: ToastOptions) => createToast("info", message, options),
  
  // Convenience methods for common use cases
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

  dismiss: (id?: string | number) => sonnerToast.dismiss(id),
  
  custom: (jsx: (id: string | number) => React.ReactElement, options?: any) => 
    sonnerToast.custom(jsx, options),
};
