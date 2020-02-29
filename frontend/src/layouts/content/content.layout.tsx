import React from 'react';
import {Switch, Route} from 'react-router-dom';
import HomePage from '../../pages/home.pages';
import SettingPage from '../../pages/settings.page';
import BujoPage from '../../pages/bujo.pages';
import GroupPage from '../../pages/group.pages';
import GroupsPage from '../../pages/groups.pages';
import AddGroup from '../../pages/addGroup.pages';
import { Layout } from 'antd';

const { Content } = Layout;
class ContentLayout extends React.Component {
  render() {
    return (
      <Content>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/bujo/:category" component={BujoPage} />
          <Route path="/settings" component={SettingPage} />
          <Route exact path="/groups" component={GroupsPage} />
          <Route exact path="/groups/addGroup" component={AddGroup} />
          <Route exact path="/groups/:groupId" component={GroupPage} />
        </Switch>
      </Content>
    );
  }
}

export default ContentLayout;
