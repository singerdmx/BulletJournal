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
import TemplatesPage from './template';
import TokenPage from "./Token";
import PublicNotificationsPage from "./public-notifications";
import PublicSampleTaskPage from "./public-sample-task.pages";

const store = createStore();

export const getCookie = (cname: string) => {
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }

    if (window.location.host === 'localhost') {
        return "discource_cookie";
    }
    return "";
}

export const inPublicPage = () => {
    return window.location.href.toLowerCase().includes('/public');
};

const isMobilePage = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return userAgent.includes('mobile') && !inPublicPage() && !window.location.href.toLowerCase().includes('/tokens');
};

function listen() {
    if (document.readyState === 'complete') {
        if (process.env.NODE_ENV === 'production' &&
            !inPublicPage() && !window.navigator.userAgent.toLowerCase().includes('mobile')) {
            const loginCookie = getCookie('__discourse_proxy');
            if (!loginCookie) {
                if (caches) {
                    // Service worker cache should be cleared with caches.delete()
                    caches.keys().then(function (names) {
                        for (let name of names) caches.delete(name).then(r => console.log(r));
                    });
                }
                window.location.reload();
            }
        }
        if (isMobilePage()) {
            window.location.href = 'https://bulletjournal.us/home/index.html' + window.location.hash;
        } else {
            ReactDOM.render(
                <Provider store={store}>
                    <BrowserRouter>
                        <Switch>
                            <Route exact path="/public/privacy" component={PrivacyPage}/>
                            <Route exact path="/public/tos" component={TermsOfServicePage}/>
                            <Route exact path="/public/items/:itemId" component={PublicPage}/>
                            <Route exact path="/public/notifications/:id" component={PublicNotificationsPage}/>
                            <Route exact path="/public/sampleTasks/:taskId" component={PublicSampleTaskPage}/>
                            <Route exact path="/tokens/:token" component={TokenPage}/>
                            <Route path="/public/templates">
                                <HashRouter>
                                    <Route path="/" component={TemplatesPage}/>
                                </HashRouter>
                            </Route>
                            <Route path="/">
                                <HashRouter>
                                    <Route path="/" component={App}/>
                                </HashRouter>
                            </Route>
                        </Switch>
                    </BrowserRouter>
                </Provider>,
                document.getElementById('root')
            );
        }
    } else {
        if (isMobilePage()) {
            window.location.href = 'https://bulletjournal.us/home/index.html' + window.location.hash;
        } else {
            ReactDOM.render(
                <Provider store={store}>
                    <Loading/>
                </Provider>,
                document.getElementById('root')
            );
        }
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
