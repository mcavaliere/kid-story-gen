'use client';

import {
  QueryClientProvider as OriginalQCP,
  QueryClient,
} from '@tanstack/react-query';

export function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  return <OriginalQCP client={queryClient}>{children}</OriginalQCP>;
}
