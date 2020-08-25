import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ProjectItemList from '../../components/project-item-list/project-item-list.component';
import BujoCalendar from '../../components/bujo-calendar/bujo-calendar.component';
import {
  CreditCardOutlined,
  CarryOutOutlined,
  SyncOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { IState } from '../../store/index';
import { Project } from '../../features/project/interface';
import AddProject from '../../components/modals/add-project.component';
import AddProjectItem from '../../components/modals/add-project-item.component';
import '@ant-design/compatible/assets/index.css';
import { BackTop, Checkbox, Tooltip } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import {
  getProjectItemsAfterUpdateSelect,
  getProjectItems,
} from '../../features/myBuJo/actions';

import './bujo.styles.less';
import RecentItemList from '../../components/recent/recent-item-list.component';

type BujoProps = {
  todoSelected: boolean;
  ledgerSelected: boolean;
  noteSelected: boolean;
  timezone: string;
  startDate: string;
  endDate: string;
  getProjectItemsAfterUpdateSelect: (
    todoSelected: boolean,
    ledgerSelected: boolean,
    noteSelected: boolean,
    category: string,
    forceToday?: boolean
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
    showForm: false,
  };

  componentDidMount() {
    const { category = 'today' } = this.props.match.params;
    document.title = `Bullet Journal - ${category.toUpperCase()}`;
  }

  componentDidUpdate(prevProps: BujoRouteParams): void {
    const { category = 'today' } = this.props.match.params;
    document.title = `Bullet Journal - ${category.toUpperCase()}`;
  }

  handleOnChange = (type: string, category: string) => {
    let { ledgerSelected, todoSelected, noteSelected } = this.props;
    if (type === 'todo') {
      todoSelected = !todoSelected;
    } else if (type === 'ledger') {
      ledgerSelected = !ledgerSelected;
    } else if (type === 'note') {
      noteSelected = !noteSelected;
    }

    this.props.getProjectItemsAfterUpdateSelect(
      todoSelected,
      ledgerSelected,
      noteSelected,
      category
    );
  };

  refresh = (category: string) => {
    let { ledgerSelected, todoSelected, noteSelected } = this.props;
    this.props.getProjectItemsAfterUpdateSelect(
      todoSelected,
      ledgerSelected,
      noteSelected,
      category
    );
  };

  getCategoryPage = (category: string) => {
    switch (category) {
      case 'today':
        return <ProjectItemList />;
      case 'calendar':
        return <BujoCalendar />;
      case 'recent':
        return <RecentItemList />;
      default:
        return null;
    }
  };

  render() {
    const { category = 'today' } = this.props.match.params;

    let plusIcon;
    if (this.props.ownedProjects.length === 0) {
      plusIcon = <AddProject history={this.props.history} mode={'MyBuJo'} />;
    } else {
      plusIcon = (
        <AddProjectItem history={this.props.history} mode={'MyBuJo'} />
      );
    }
    let noteCheckbox = null;
    if (category === 'recent') {
      noteCheckbox = (
        <Checkbox
          checked={this.props.noteSelected}
          value="note"
          onChange={(e) => this.handleOnChange(e.target.value, category)}
        >
          <Tooltip placement="top" title="NOTE">
            <FileTextOutlined />
          </Tooltip>
        </Checkbox>
      );
    }
    return (
      <div className={`todo ${category}`}>
        <div className="todo-header">
          <div className="header-check">
            <Checkbox
              checked={this.props.todoSelected}
              value="todo"
              onChange={(e) => this.handleOnChange(e.target.value, category)}
            >
              <Tooltip placement="top" title="TODO">
                <CarryOutOutlined />
              </Tooltip>
            </Checkbox>
            {noteCheckbox}
            <Checkbox
              checked={this.props.ledgerSelected}
              value="ledger"
              onChange={(e) => this.handleOnChange(e.target.value, category)}
            >
              <Tooltip placement="top" title="LEDGER">
                <CreditCardOutlined />
              </Tooltip>
            </Checkbox>
            <Tooltip title="Refresh">
              <SyncOutlined
                className="refreshButton"
                onClick={(e) => this.refresh(category)}
              />
            </Tooltip>
          </div>

          {plusIcon}
        </div>
        <BackTop />
        {this.getCategoryPage(category)}
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  ownedProjects: state.project.owned,
  todoSelected: state.myBuJo.todoSelected,
  ledgerSelected: state.myBuJo.ledgerSelected,
  noteSelected: state.myBuJo.noteSelected,
  timezone: state.myself.timezone,
  startDate: state.myBuJo.startDate,
  endDate: state.myBuJo.endDate,
});

export default connect(mapStateToProps, {
  getProjectItemsAfterUpdateSelect,
  getProjectItems,
})(withRouter(BujoPage));
