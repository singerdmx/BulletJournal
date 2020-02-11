import React from 'react';
import {Switch, Route} from 'react-router-dom';
import HomePage from './pages/home.pages';
import SettingPage from './pages/settings.page';

import './App.less';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/settings" component={SettingPage}/>
        </Switch>
      </div>
    );
  }
}

export default App;
