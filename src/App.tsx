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
import { ProductEnum, getProduct } from 'utils/apiService';
import { getLearnUrl } from 'utils/misc';
import UserOnboard from 'components/UserOnboard';
import './i18n/config';

function App() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  if (getProduct() === ProductEnum.Lxp && !isDesktop && isDesktop !== null) {
    window.location.replace(getLearnUrl());
  }

  return isDesktop ? (
    <QueryClientProvider client={queryClient}>
      <ProductProvider>
        <AuthProvider>
          {process.env.NODE_ENV === 'development' ? (
            <section aria-hidden="true">
              <ReactQueryDevtools initialIsOpen={false} />
            </section>
          ) : null}
          <UserOnboard />
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
