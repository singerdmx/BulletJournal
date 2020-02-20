import React from 'react';
import {Switch, Route} from 'react-router-dom';
import HomePage from '../../pages/home.pages';
import SettingPage from '../../pages/settings.page';
import TodoPage from '../../pages/todo.pages';
import GroupPage from '../../pages/group.pages';
import { Layout } from 'antd';

const { Content } = Layout;
class ContentLayout extends React.Component {
  render() {
    return (
      <Content>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/todo/:category" component={TodoPage} />
          <Route path="/settings" component={SettingPage} />
          <Route exact path="/groups/:groupId" component={GroupPage} />
        </Switch>
      </Content>
    );
  }
}

export default ContentLayout;
