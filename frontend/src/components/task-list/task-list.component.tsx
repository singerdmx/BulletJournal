import React from 'react';
import TodoItem from '../../components/todo-item/todo-item.component';
import { List, DatePicker } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { Link } from 'react-router-dom';
import { updateExpandedMyself } from '../../features/myself/actions';

type TaskProps = {
  data: string[];
  updateExpandedMyself: (updateSettings: boolean) => void;
  timezone: string;
};

class TaskList extends React.Component<TaskProps> {
  componentDidMount() {
    this.props.updateExpandedMyself(true);
  }

  render() {
    const dateFormat = 'YYYY-MM-DD';

    const { RangePicker } = DatePicker;
    return (
      <div className='todo-list'>
        <div className='todo-panel'>
          <RangePicker
            defaultValue={[
              moment('2015-01-01', dateFormat),
              moment('2015-01-01', dateFormat)
            ]}
            format={dateFormat}
          />
          <Link
            to='/settings'
            title='Change Time Zone'
            style={{ paddingLeft: '30px' }}
          >
            {this.props.timezone}
          </Link>
        </div>
        <List
          itemLayout='horizontal'
          dataSource={this.props.data}
          renderItem={item => <TodoItem title={item} />}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  timezone: state.myself.timezone
});

export default connect(mapStateToProps, {
  updateExpandedMyself
})(TaskList);
