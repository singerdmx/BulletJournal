import React from 'react';
import TodoItem from '../../components/todo-item/todo-item.component';
import { List, DatePicker } from 'antd';
import moment from 'moment';

type TaskProps = {
  data: string[];
};

class TaskList extends React.Component<TaskProps> {
  render() {
    const dateFormat = 'YYYY-MM-DD';

    const { RangePicker } = DatePicker;
    return (
      <div className="todo-list">
        <div className="todo-panel">
          <RangePicker
            defaultValue={[
              moment('2015-01-01', dateFormat),
              moment('2015-01-01', dateFormat)
            ]}
            format={dateFormat}
          />
        </div>
        <List
          itemLayout="horizontal"
          dataSource={this.props.data}
          renderItem={item => <TodoItem title={item} />}
        />
      </div>
    );
  }
}

export default TaskList;
