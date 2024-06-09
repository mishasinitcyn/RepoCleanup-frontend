import { ReactNode } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  children: ReactNode;
}

export default function ErrorAlert({ children }: ErrorAlertProps) {
  return (
    <Alert
      variant='destructive'
      className='flex gap-2 h-10 py-2 bg-red-50 items-center'
    >
      <div>
        <AlertCircle className='size-4' />
      </div>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
