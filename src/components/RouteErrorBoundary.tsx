import { useEffect } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CHUNK_LOAD_ERROR = /failed to fetch dynamically imported module|importing a module script failed|error loading dynamically imported module/i;
const RELOAD_FLAG = 'chunk-reload-attempted';

function getErrorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) return error.statusText || `${error.status}`;
  if (error instanceof Error) return error.message;
  return String(error);
}

export default function RouteErrorBoundary() {
  const error = useRouteError();
  const message = getErrorMessage(error);
  const isChunkLoadError = CHUNK_LOAD_ERROR.test(message);

  useEffect(() => {
    if (!isChunkLoadError) return;
    // A stale tab referencing a chunk hash from a previous deploy - reload once to
    // pick up the current index.html and its matching asset hashes.
    if (sessionStorage.getItem(RELOAD_FLAG)) return;
    sessionStorage.setItem(RELOAD_FLAG, '1');
    window.location.reload();
  }, [isChunkLoadError]);

  if (isChunkLoadError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <p className="text-sm text-muted-foreground">Loading latest version...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <CardTitle className="text-destructive">Something went wrong</CardTitle>
          </div>
          <CardDescription>An unexpected error occurred while loading this page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-3 rounded-md">
            <code className="text-sm text-destructive break-all">{message}</code>
          </div>
          <Button onClick={() => window.location.reload()} variant="default">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reload Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
