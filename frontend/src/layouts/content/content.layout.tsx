import React from 'react';
import { Switch, Route } from 'react-router-dom';
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
import CompletedTaskPage from '../../pages/task/completed-task.pages';
import { Layout } from 'antd';
import SearchCompletedTasksPage from '../../pages/project/search-completed-tasks.pages';
import AdminPage from '../../pages/admin/admin.pages';
import PunchCardPage from "../../pages/punch-card/punch-card.pages";
import SearchPage from "../../pages/search/search.pages";
import TaskStatusPage from "../../pages/task-status/task-status.pages";
import PublicPage from "../../Public";
import PointsPage from "../../pages/points/points.pages";
import ProjectStatisticsPage from "../../pages/statistics/statistics.pages";
import AdminCategoriesPage from "../../pages/admin/categories.pages";
import AdminWorkflowPage from "../../pages/admin/workflow.pages";
import AdminCategoryPage from "../../pages/admin/category.pages";
import AdminStepsPage from "../../pages/admin/steps.pages";
import AdminStepPage from "../../pages/admin/step.pages";
import AdminMetadataPage from "../../pages/admin/admin-metadata.pages";
import AdminSampleTaskPage from "../../pages/admin/sample-task.pages";
import SampleTaskPage from "../../pages/task/sample-task.pages";
import {PaymentPage} from "../../pages/payment/payment.pages";

const { Content } = Layout;
class ContentLayout extends React.Component {
  render() {
    return (
      <Content className='content'>
        <Switch>
          <Route exact path='/' component={BujoPage} />
          <Route exact path='/bujo/:category' component={BujoPage} />
          <Route exact path='/points' component={PointsPage} />
          <Route exact path='/settings' component={SettingPage} />
          <Route exact path='/googleCalendar' component={SettingPage} />
          <Route exact path='/projects' component={ProjectsPage} />
          <Route exact path='/projects/:projectId' component={ProjectPage} />
          <Route exact path='/projects/:projectId/taskStatus' component={TaskStatusPage} />
          <Route exact path='/projects/:projectId/statistics' component={ProjectStatisticsPage} />
          <Route exact path='/groups' component={GroupsPage} />
          <Route exact path='/groups/:groupId' component={GroupPage} />
          <Route exact path='/labels/:createOrSearch' component={LabelsPage} />
          <Route path='/labels' component={LabelsPage} />
          <Route exact path='/note/:noteId' component={NotePage} />
          <Route exact path='/task/:taskId' component={TaskPage} />
          <Route exact path='/payment' component={PaymentPage} />
          <Route
            exact
            path='/completedTask/:taskId'
            component={CompletedTaskPage}
          />
          <Route
            exact
            path='/completedTasks/:projectId/search'
            component={SearchCompletedTasksPage}
          />
          <Route exact path='/admin' component={AdminPage} />
          <Route exact path='/admin/categories' component={AdminCategoriesPage} />
          <Route exact path='/admin/metadata' component={AdminMetadataPage} />
          <Route exact path='/admin/categories/:categoryId' component={AdminCategoryPage} />
          <Route exact path='/admin/categories/:categoryId/steps' component={AdminStepsPage} />
          <Route exact path='/admin/steps/:stepId' component={AdminStepPage} />
          <Route exact path='/admin/sampleTasks/:sampleTaskId' component={AdminSampleTaskPage} />
          <Route exact path='/sampleTasks/:taskId' component={SampleTaskPage} />
          <Route exact path='/admin/workflow' component={AdminWorkflowPage} />
          <Route exact path='/punchCard' component={PunchCardPage} />
          <Route exact path='/search/:term' component={SearchPage} />
          <Route
            exact
            path='/transaction/:transactionId'
            component={TransactionPage}
          />
          <Route exact path="/sharedItems/:itemId" component={PublicPage} />
        </Switch>
      </Content>
    );
  }
}

export default ContentLayout;
