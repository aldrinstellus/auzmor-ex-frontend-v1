import './App.css';
import Router from './components/Router';
import AuthProvider from 'contexts/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';

import queryClient from 'utils/queryClient';
import Toast from 'components/Toast';
import useMediaQuery from 'hooks/useMediaQuery';
import Unsupported from 'pages/Unsupported';
import ProductProvider from 'contexts/ProductProvider';
import { ProductEnum, getProduct } from 'utils/apiService';
import { getLearnUrl } from 'utils/misc';
import UserOnboard from 'components/UserOnboard';
import LxpRouter from 'components/LxpRouter';
import './i18n/config';
import FontFamilySwitcher from 'components/FontFamilySwitcher';

function App() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // Allow login and auth pages on mobile
  const isAuthPage = window.location.pathname === '/login' ||
                     window.location.pathname === '/forgot-password' ||
                     window.location.pathname.startsWith('/reset-password');
  const allowMobile = isAuthPage;

  if (getProduct() === ProductEnum.Lxp && !isDesktop && isDesktop !== null) {
    window.location.replace(getLearnUrl());
  }

  return (isDesktop || allowMobile) ? (
    <QueryClientProvider client={queryClient}>
      <ProductProvider>
        <AuthProvider>
          <UserOnboard />
          <FontFamilySwitcher>
            {getProduct() === ProductEnum.Lxp ? <LxpRouter /> : <Router />}
          </FontFamilySwitcher>
          <Toast />
        </AuthProvider>
      </ProductProvider>
    </QueryClientProvider>
  ) : (
    <Unsupported />
  );
}

export default App;
