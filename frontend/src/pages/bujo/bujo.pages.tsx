import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ProjectItemList from '../../components/project-item-list/project-item-list.component';
import BujoCalendar from '../../components/bujo-calendar/bujo-calendar.component';
import { AccountBookOutlined, CarryOutOutlined } from '@ant-design/icons';
import { IState } from '../../store/index';
import { Project } from '../../features/project/interface';
import AddProject from '../../components/modals/add-project.component';
import AddProjectItem from '../../components/modals/add-project-item.component';
import '@ant-design/compatible/assets/index.css';
import { Checkbox, Tooltip } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import {
  getProjectItemsAfterUpdateSelect,
  getProjectItems
} from '../../features/myBuJo/actions';

import './bujo.styles.less';

type BujoProps = {
  todoSelected: boolean;
  ledgerSelected: boolean;
  timezone: string;
  startDate: string;
  endDate: string;
  getProjectItemsAfterUpdateSelect: (
    todoSelected: boolean,
    ledgerSelected: boolean,
    category: string
  ) => void;
  getProjectItems: (
    startDate: string,
    endDate: string,
    timezone: string,
    category: string
  ) => void;
};

type BujoRouteParams = {
  category: string;
};
interface BujoRouteProps extends RouteComponentProps<BujoRouteParams> {
  category: string;
}

type todoState = {
  showForm: boolean;
};

type ProjectProps = {
  ownedProjects: Project[];
};

class BujoPage extends React.Component<
  BujoRouteProps & ProjectProps & BujoProps,
  todoState
> {
  state: todoState = {
    showForm: false
  };

  handleOnChange = (type: string) => {
    const { category } = this.props.match.params;
    let { ledgerSelected, todoSelected } = this.props;
    if (type === 'todo') {
      todoSelected = !todoSelected;
    } else {
      ledgerSelected = !ledgerSelected;
    }

    this.props.getProjectItemsAfterUpdateSelect(
      todoSelected,
      ledgerSelected,
      category
    );
  };

  render() {
    const { category } = this.props.match.params;
    let plusIcon = null;
    if (this.props.ownedProjects.length === 0) {
      plusIcon = <AddProject history={this.props.history} mode={'MyBuJo'} />;
    } else {
      plusIcon = <AddProjectItem history={this.props.history} mode={'MyBuJo'} />;
    }
    return (
      <div className='todo'>
        <div className='todo-header'>
          <div className='header-check'>
            <Checkbox
              checked={this.props.todoSelected}
              value='todo'
              onChange={e => this.handleOnChange(e.target.value)}
            >
              <Tooltip placement='top' title='TODO'>
                <CarryOutOutlined />
              </Tooltip>
            </Checkbox>
            <Checkbox
              checked={this.props.ledgerSelected}
              value='ledger'
              onChange={e => this.handleOnChange(e.target.value)}
            >
              <Tooltip placement='top' title='LEDGER'>
                <AccountBookOutlined />
              </Tooltip>
            </Checkbox>
          </div>

          {plusIcon}
        </div>

        {category === 'today' ? <ProjectItemList /> : <BujoCalendar />}
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  ownedProjects: state.project.owned,
  todoSelected: state.myBuJo.todoSelected,
  ledgerSelected: state.myBuJo.ledgerSelected,
  timezone: state.myself.timezone,
  startDate: state.myBuJo.startDate,
  endDate: state.myBuJo.endDate
});

export default connect(mapStateToProps, {
  getProjectItemsAfterUpdateSelect,
  getProjectItems
})(withRouter(BujoPage));
