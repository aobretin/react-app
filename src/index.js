import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import App from 'App';
import registerServiceWorker from './registerServiceWorker';
import {Provider} from "mobx-react";

import CartProvider from 'CartProvider';
import CurrencyProvider from 'CurrencyProvider';
import LanguagesProvider from 'LanguagesProvider';
import IsMobileProvider from 'IsMobileProvider';
import UserProvider from 'UserProvider';

ReactDOM.render(
  <BrowserRouter>
    <Provider
    	view={IsMobileProvider.provider}
    	cartData={CartProvider.cartData}
    	currencyValues={CurrencyProvider.values}
      languagesData={LanguagesProvider.data}
      user={UserProvider.values.methods}
    >
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

registerServiceWorker();
