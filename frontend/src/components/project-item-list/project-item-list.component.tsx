import React from 'react';
import { DatePicker, Tooltip, Divider, Timeline, Collapse } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { Link } from 'react-router-dom';
import { AccountBookOutlined, CarryOutOutlined } from '@ant-design/icons';
import { updateExpandedMyself } from '../../features/myself/actions';
import { dateFormat } from '../../features/myBuJo/constants';
import {
  getProjectItems,
  updateMyBuJoDates
} from '../../features/myBuJo/actions';
import { ProjectType } from '../../features/project/constants';
import { ProjectItems } from '../../features/myBuJo/interface';

const { RangePicker } = DatePicker;
const { Panel } = Collapse;

type ProjectItemProps = {
  todoSelected: boolean;
  ledgerSelected: boolean;
  timezone: string;
  startDate: string;
  endDate: string;
  projectItems: ProjectItems[];
  updateExpandedMyself: (updateSettings: boolean) => void;
  updateMyBuJoDates: (startDate: string, endDate: string) => void;
  getProjectItems: (
    types: ProjectType[],
    startDate: string,
    endDate: string,
    timezone: string
  ) => void;
};

class ProjectItemList extends React.Component<ProjectItemProps> {
  componentDidMount() {
    this.props.updateExpandedMyself(true);
  }

  handleRangeChange = (dates: any, dateStrings: string[]) => {
    let projectTypeArray = [];
    if (this.props.ledgerSelected) projectTypeArray.push(ProjectType.LEDGER);
    if (this.props.todoSelected) projectTypeArray.push(ProjectType.TODO);
    this.props.updateMyBuJoDates(dateStrings[0], dateStrings[1]);
    this.props.getProjectItems(
      projectTypeArray,
      dateStrings[0],
      dateStrings[1],
      this.props.timezone
    );
  };

  getTasksPanel = (items: ProjectItems, index: number) => {
    if (items.tasks.length === 0) {
      return null;
    }
    return (
      <Panel
        header={items.dayOfWeek}
        key={`tasks${index}`}
        extra={<CarryOutOutlined />}
      ></Panel>
    );
  };

  getTransactionsPanel = (items: ProjectItems, index: number) => {
    if (items.transactions.length === 0) {
      return null;
    }
    return (
      <Panel
        header={items.dayOfWeek}
        key={`transactions${index}`}
        extra={<AccountBookOutlined />}
      ></Panel>
    );
  };

  render() {
    return (
      <div className='todo-list'>
        <div className='todo-panel'>
          <RangePicker
            value={[
              moment(
                this.props.startDate
                  ? this.props.startDate
                  : new Date().toLocaleString('fr-CA'),
                dateFormat
              ),
              moment(
                this.props.endDate
                  ? this.props.endDate
                  : new Date().toLocaleString('fr-CA'),
                dateFormat
              )
            ]}
            format={dateFormat}
            onChange={this.handleRangeChange}
          />
          <Tooltip placement='top' title='Change Time Zone'>
            <Link to='/settings' style={{ paddingLeft: '30px' }}>
              {this.props.timezone}
            </Link>
          </Tooltip>
        </div>
        <Divider></Divider>
        <div>
          {
            <Timeline mode={'left'}>
              {this.props.projectItems.map((items, index) => {
                return (
                  <Timeline.Item
                    label={items.date}
                    style={{ marginLeft: '-65%' }}
                  >
                    <Collapse
                      defaultActiveKey={[
                        'tasks' + index,
                        'transactions' + index
                      ]}
                    >
                      {this.getTasksPanel(items, index)}
                      {this.getTransactionsPanel(items, index)}
                    </Collapse>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  timezone: state.myself.timezone,
  startDate: state.myBuJo.startDate,
  endDate: state.myBuJo.endDate,
  projectItems: state.myBuJo.projectItems,
  todoSelected: state.myBuJo.todoSelected,
  ledgerSelected: state.myBuJo.ledgerSelected
});

export default connect(mapStateToProps, {
  updateExpandedMyself,
  updateMyBuJoDates,
  getProjectItems
})(ProjectItemList);
