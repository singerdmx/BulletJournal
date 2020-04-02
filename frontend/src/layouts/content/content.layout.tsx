import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from '../../pages/home/home.pages';
import SettingPage from '../../pages/settings/settings.page';
import BujoPage from '../../pages/bujo/bujo.pages';
import GroupPage from '../../pages/group/group.pages';
import GroupsPage from '../../pages/groups/groups.pages';
import ProjectPage from '../../pages/project/project.pages';
import ProjectsPage from '../../pages/projects/projects.pages';
import LabelsPage from '../../pages/labels';
import NotePage from '../../pages/note/note.pages';
import TaskPage from "../../pages/task/task.pages";
import { Layout } from 'antd';

const { Content } = Layout;
class ContentLayout extends React.Component {
  render() {
    return (
      <Content className="content">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/bujo/:category" component={BujoPage} />
          <Route exact path="/settings" component={SettingPage} />
          <Route exact path="/projects" component={ProjectsPage} />
          <Route exact path="/projects/:projectId" component={ProjectPage} />
          <Route exact path="/groups" component={GroupsPage} />
          <Route exact path="/groups/:groupId" component={GroupPage} />
          <Route exact path="/labels/:createOrSearch" component={LabelsPage} />
          <Route path="/labels" component={LabelsPage} />
          <Route exact path="/note/:noteId" component={NotePage} />
          <Route exact path="/task/:taskId" component={TaskPage} />
        </Switch>
      </Content>
    );
  }
}

export default ContentLayout;
