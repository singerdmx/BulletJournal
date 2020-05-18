import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import createStore from './store';
import { Provider } from 'react-redux';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { unregister } from './serviceWorker';
import PublicPage from './Public';
import PrivacyPage from './Privacy';
import TermsOfServicePage from './TermsOfService';

const store = createStore();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route path="/public/privacy" component={PrivacyPage} />
        <Route path="/public/tos" component={TermsOfServicePage} />
        <Route path="/public/items/:itemId" component={PublicPage} />
        <Route path="/" component={App} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

unregister();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

// **** DEPRECIATED ****

// if (Notification.permission === 'granted') {
//   serviceWorker.register();
// } else if (Notification.permission !== 'denied') {
//   Notification.requestPermission().then((permission) => {
//     if (permission === 'granted') {
//       serviceWorker.register();
//     }
//   });
// }
