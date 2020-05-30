import React from 'react';
import ReactDOM from 'react-dom';
import App, { Loading } from './App';
import createStore from './store';
import { Provider } from 'react-redux';
import { HashRouter, Switch, Route } from 'react-router-dom';
import { unregister } from './serviceWorker';
import PublicPage from './Public';
import PrivacyPage from './Privacy';
import TermsOfServicePage from './TermsOfService';
import FeaturePage from './Feature';

const store = createStore();

function listen() {
  if (document.readyState === 'complete') {
    ReactDOM.render(
      <Provider store={store}>
        <HashRouter>
          <Switch>
            <Route path="/public/privacy" component={PrivacyPage} />
            <Route path="/public/tos" component={TermsOfServicePage} />
            <Route path="/public/items/:itemId" component={PublicPage} />
            <Route path="/public" component={FeaturePage} />
            <Route path="/" component={App} />
          </Switch>
        </HashRouter>
      </Provider>,
      document.getElementById('root')
    );
  } else {
    ReactDOM.render(
      <Provider store={store}>
        <Loading />
      </Provider>,
      document.getElementById('root')
    );
  }
}

document.onreadystatechange = listen;

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
