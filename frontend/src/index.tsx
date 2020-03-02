import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import createStore from './store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import './index.less';
import * as serviceWorker from './serviceWorker';

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
if (Notification.permission === 'granted') {
  serviceWorker.register();
} else if (Notification.permission !== 'denied') {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      serviceWorker.register();
    }
  });
}


