import React, { useEffect } from 'react';
import moment from 'moment';
import { ContentType, dateFormat } from '../../features/myBuJo/constants';
import {DatePicker, Divider, Empty, Tooltip} from 'antd';
import { Link } from 'react-router-dom';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { updateRecentItemsDates } from '../../features/recent/actions';
import { updateExpandedMyself } from '../../features/myself/actions';
import { ProjectItem } from '../../features/myBuJo/interface';
import TaskItem from '../project-item/task-item.component';
import NoteItem from '../project-item/note-item.component';
import { Task } from '../../features/tasks/interface';
import { Note } from '../../features/notes/interface';
import TransactionItem from '../project-item/transaction-item.component';
import { Transaction } from '../../features/transactions/interface';
import { ProjectItemUIType } from '../../features/project/constants';
import './recent-item-list.styles.less';

const { RangePicker } = DatePicker;

type RecentItemProps = {
  todoSelected: boolean;
  ledgerSelected: boolean;
  noteSelected: boolean;
  timezone: string;
  startDate: string;
  endDate: string;
  items: ProjectItem[];
  updateRecentItemsDates: (startDate: string, endDate: string) => void;
  updateExpandedMyself: (updateSettings: boolean) => void;
};

const RecentItemList: React.FC<RecentItemProps> = ({
  todoSelected,
  ledgerSelected,
  noteSelected,
  timezone,
  startDate,
  endDate,
  items,
  updateRecentItemsDates,
  updateExpandedMyself,
}) => {
  useEffect(() => {
    updateExpandedMyself(true);
    if (timezone) updateRecentItemsDates(startDate, endDate);
  }, []);

  const handleRangeChange = (dates: any, dateStrings: string[]) => {
    updateRecentItemsDates(dateStrings[0], dateStrings[1]);
  };

  const renderItem = (projectItem: ProjectItem) => {
    switch (projectItem.contentType) {
      case ContentType.TASK: {
        return (
          <TaskItem
            task={projectItem as Task}
            type={ProjectItemUIType.RECENT}
            isComplete={false}
            readOnly={false}
            inModal={false}
            inProject={false}
            completeOnlyOccurrence={false}
          />
        );
      }
      case ContentType.NOTE: {
        return (
          <NoteItem
            note={projectItem as Note}
            type={ProjectItemUIType.RECENT}
            readOnly={false}
            inProject={false}
            inModal={false}
          />
        );
      }
      case ContentType.TRANSACTION: {
        return (
          <TransactionItem
            type={ProjectItemUIType.RECENT}
            transaction={projectItem as Transaction}
            inModal={false}
            inProject={false}
          />
        );
      }
      default:
        return null;
    }
  };

  function getRecentItemList() {
    if (!items || items.length === 0) {
      return <Empty/>
    }
    return items.map((projectItem) => {
      return (
          <div className="project-item-div" key={projectItem.id}>
            {renderItem(projectItem)}
          </div>
      );
    });
  }

  return (
    <>
      <div className="todo-panel">
        <RangePicker
          ranges={{
            Today: [moment(), moment()],
            'This Week': [moment().startOf('week'), moment().endOf('week')],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
          }}
          allowClear={false}
          value={[moment(startDate, dateFormat), moment(endDate, dateFormat)]}
          format={dateFormat}
          onChange={handleRangeChange}
        />
        <Tooltip placement="top" title="Change Time Zone">
          <Link to="/settings" style={{ paddingLeft: '30px' }}>
            {timezone}
          </Link>
        </Tooltip>
      </div>
      <Divider />
      <div className="todo-contents">
        {getRecentItemList()}
      </div>
    </>
  );
};

const mapStateToProps = (state: IState) => ({
  timezone: state.myself.timezone,
  startDate: state.recent.startDate,
  endDate: state.recent.endDate,
  todoSelected: state.myBuJo.todoSelected,
  ledgerSelected: state.myBuJo.ledgerSelected,
  noteSelected: state.myBuJo.noteSelected,
  items: state.recent.items,
});

export default connect(mapStateToProps, {
  updateRecentItemsDates,
  updateExpandedMyself,
})(RecentItemList);
