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
import { getLearnUrl, getSubDomain } from 'utils/misc';

// Redirect to learn if user lands on lxp generic page.
if (getProduct() === ProductEnum.Lxp && !!!getSubDomain(window.location.host)) {
  if (process.env.NODE_ENV !== 'development') {
    window.location.replace(
      process.env.REACT_APP_LEARN_BASE_URL || `https://learn.auzmor.com`,
    );
  }
}

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
