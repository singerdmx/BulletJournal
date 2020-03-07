import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import TaskList from '../components/task-list/task-list.component';
import BujoCalendar from '../components/bujo-calendar/bujo-calendar.component';
import {
  AccountBookOutlined,
  CarryOutOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { IState } from '../store/index';
import { Project } from '../features/project/interfaces';
import AddProject from '../components/modals/add-project.component';
import AddProjectItem from '../components/modals/add-project-item.component';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Checkbox, Tooltip } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

type BujoRouteParams = {
  category: string;
};
interface BujoRouteProps extends RouteComponentProps<BujoRouteParams> {
  category: string;
}

type todoState = {
  showForm: boolean;
};

const fakeData = ['Frontend', 'Bakcend', 'UI designer'];

type ProjectProps = {
  ownedProjects: Project[];
}

class BujoPage extends React.Component<BujoRouteProps & ProjectProps, todoState> {
  state: todoState = {
    showForm: false
  };

  render() {
    const { category } = this.props.match.params;
    let plusIcon = null;
    if (this.props.ownedProjects.length === 0) {
      plusIcon = <AddProject history={this.props.history} mode={'MyBuJo'}/>
    } else {
      plusIcon = <AddProjectItem mode={'MyBuJo'}/>
    }
    return (
      <div className='todo'>
        <div className='todo-header'>
          <Checkbox.Group defaultValue={['todo']} className='header-check'>
            <Checkbox value='todo'>
              <Tooltip placement="top" title='TODO'>
                <CarryOutOutlined  />
              </Tooltip>
            </Checkbox>
            <Checkbox value='ledger'>
              <Tooltip placement="top" title='LEDGER'>
                <AccountBookOutlined />
              </Tooltip>
            </Checkbox>
          </Checkbox.Group>

          {plusIcon}
        </div>

        {category === 'today' ? <TaskList data={fakeData} /> : <BujoCalendar />}
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  ownedProjects: state.project.owned
});

export default connect(mapStateToProps, {
})(withRouter(BujoPage));