import React from 'react';
import {Switch, Route} from 'react-router-dom';
import HomePage from '../../pages/home.pages';
import SettingPage from '../../pages/settings.page';
import { Layout } from 'antd';

const { Content } = Layout;
class ContentLayout extends React.Component {
  render() {
    return (
      <Content style={{ padding: '0 24px', minHeight: 280 }}>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/settings" component={SettingPage} />
        </Switch>
      </Content>
    );
  }
}

export default ContentLayout;
