import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 15 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export default queryClient;
