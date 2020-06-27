import React from 'react';
import ReactDOM from 'react-dom';
import App, {Loading} from './App';
import createStore from './store';
import {Provider} from 'react-redux';
import {BrowserRouter, HashRouter, Route, Switch} from 'react-router-dom';
import {unregister} from './serviceWorker';
import PublicPage from './Public';
import PrivacyPage from './Privacy';
import TermsOfServicePage from './TermsOfService';
import TemplatesPage from './templates';

const store = createStore();

function listen() {
    if (document.readyState === 'complete') {
        ReactDOM.render(
            <Provider store={store}>
                <BrowserRouter>
                    <Switch>
                        <Route path="/">
                            <HashRouter>
                                <Route path="/" component={App}/>
                            </HashRouter>
                        </Route>
                        <Route exact path="/public/privacy" component={PrivacyPage}/>
                        <Route exact path="/public/tos" component={TermsOfServicePage}/>
                        <Route exact path="/public/templates" component={TemplatesPage}/>
                        <Route exact path="/public/items/:itemId" component={PublicPage}/>
                    </Switch>
                </BrowserRouter>
            </Provider>,
            document.getElementById('root')
        );
    } else {
        ReactDOM.render(
            <Provider store={store}>
                <Loading/>
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
