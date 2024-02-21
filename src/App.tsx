import './App.css';
import Router from './components/Router';
import AuthProvider from 'contexts/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import queryClient from 'utils/queryClient';
import Toast from 'components/Toast';
import useMediaQuery from 'hooks/useMediaQuery';
import Unsupported from 'pages/Unsupported';
import ProductProvider from 'contexts/ProductProvider';

function App() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return isDesktop ? (
    <QueryClientProvider client={queryClient}>
      <ProductProvider>
        <AuthProvider>
          {process.env.NODE_ENV === 'development' ? (
            <ReactQueryDevtools initialIsOpen={false} />
          ) : null}
          <Router />
          <Toast />
        </AuthProvider>
      </ProductProvider>
    </QueryClientProvider>
  ) : (
    <Unsupported />
  );
}

export default App;
