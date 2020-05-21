import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import SettingPage from '../../pages/settings/settings.page';
import BujoPage from '../../pages/bujo/bujo.pages';
import GroupPage from '../../pages/group/group.pages';
import GroupsPage from '../../pages/groups/groups.pages';
import ProjectPage from '../../pages/project/project.pages';
import ProjectsPage from '../../pages/projects/projects.pages';
import LabelsPage from '../../pages/labels';
import NotePage from '../../pages/note/note.pages';
import TaskPage from '../../pages/task/task.pages';
import TransactionPage from '../../pages/transaction/transaction.pages';
import CompletedTaskPage from "../../pages/task/completed-task.pages";
import { Layout } from 'antd';
import SearchCompletedTasksPage from "../../pages/project/search-completed-tasks.pages";
import AdminPage from "../../pages/admin/admin.pages";

const { Content } = Layout;
class ContentLayout extends React.Component {
  render() {
    return (
      <Content className="content">
        <Switch>
          <Redirect exact from="/" to="/bujo/today" />
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
          <Route exact path="/completedTask/:taskId" component={CompletedTaskPage} />
          <Route exact path="/completedTasks/search" component={SearchCompletedTasksPage} />
          <Route exact path="/admin" component={AdminPage} />
          <Route
            exact
            path="/transaction/:transactionId"
            component={TransactionPage}
          />
        </Switch>
      </Content>
    );
  }
}

export default ContentLayout;
