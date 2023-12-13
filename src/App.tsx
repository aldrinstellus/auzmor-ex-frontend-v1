import './App.css';
import Router from './components/Router';
import AuthProvider from 'contexts/AuthContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import queryClient from 'utils/queryClient';
import Toast from 'components/Toast';
import useMediaQuery from 'hooks/useMediaQuery';
import Unsupported from 'pages/Unsupported';
import { getSubDomain } from 'utils/misc';

// favicon loading animations
let counter = 0;
let faviconInterval: any = null;
(() => {
  faviconInterval = setInterval(() => {
    counter %= 4;
    document
      .querySelector('link[rel="icon"]')
      ?.setAttribute('href', `/loading-${counter + 1}.svg`);
    counter += 1;
  }, 300);
})();
export const clearFaviconInterval = () => {
  clearInterval(faviconInterval);
};
const domain = getSubDomain(window.location.host);
if (!!!domain) {
  clearInterval(faviconInterval);
  try {
    // use default favicon
    document
      .querySelector('link[rel="icon"]')
      ?.setAttribute('href', '/favicon.ico');
  } catch (e) {}
}

function App() {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  return isDesktop ? (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {process.env.NODE_ENV === 'development' ? (
          <ReactQueryDevtools initialIsOpen={false} />
        ) : null}
        <Router />
        <Toast />
      </AuthProvider>
    </QueryClientProvider>
  ) : (
    <Unsupported />
  );
}

export default App;
