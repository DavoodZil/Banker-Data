// Global type declarations for TypeScript

declare global {
  interface Window {
    Plaid: {
      create: (config: any) => any;
      destroy: () => void;
    };
  }
}

// Component prop types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Common UI component props
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
}

export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface PopoverProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface TooltipProps {
  children?: React.ReactNode;
  content?: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
}

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
}

export interface FormProps {
  onSubmit?: (e: React.FormEvent) => void;
  children?: React.ReactNode;
  className?: string;
}

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  htmlFor?: string;
}

export interface TabsProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export interface AccordionProps {
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
}

export interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  children?: React.ReactNode;
}

export interface ProgressProps {
  value?: number;
  max?: number;
  className?: string;
}

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export interface ToastProps {
  id?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  duration?: number;
  onDismiss?: () => void;
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export interface TableProps {
  children?: React.ReactNode;
  className?: string;
}

export interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
    current?: boolean;
  }>;
  className?: string;
}

export {};