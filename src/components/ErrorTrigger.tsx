import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ErrorTrigger: React.FC = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('This is a test error thrown by ErrorTrigger component!');
  }

  const triggerError = () => {
    setShouldThrow(true);
  };

  const triggerAsyncError = () => {
    setTimeout(() => {
      throw new Error('This is an async error that won\'t be caught by error boundary');
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Error Boundary Test</CardTitle>
        <CardDescription>
          Click the buttons below to test error handling
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={triggerError}
          variant="destructive"
          className="w-full"
        >
          Trigger Render Error
        </Button>
        <Button 
          onClick={triggerAsyncError}
          variant="outline"
          className="w-full"
        >
          Trigger Async Error (Console Only)
        </Button>
        <p className="text-xs text-muted-foreground">
          The first button will be caught by the error boundary. 
          The second will only show in console.
        </p>
      </CardContent>
    </Card>
  );
};

export default ErrorTrigger;
