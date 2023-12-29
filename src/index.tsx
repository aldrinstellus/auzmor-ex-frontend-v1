import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { StrictMode } from 'react';
import { getItem } from 'utils/persist';

const root = ReactDOM.createRoot(
  document.getElementById('officeApp') as HTMLElement,
);

// read favicon and page title from loacal storage and replce it in DOM
const favicon = getItem('favicon', '');
const pageTitle = getItem('pageTitle', 'Auzmor Office');
document.querySelector('link[rel="icon"]')?.setAttribute('href', favicon);
document.querySelector('title')!.innerText = pageTitle;

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
