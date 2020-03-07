import React from 'react';
import TodoItem from '../../components/todo-item/todo-item.component';
import { List, DatePicker, Tooltip } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { Link } from 'react-router-dom';
import { updateExpandedMyself } from '../../features/myself/actions';

type TaskProps = {
  data: string[];
  updateExpandedMyself: (updateSettings: boolean) => void;
  timezone: string;
  startDate: string;
  endDate: string;
};

class TaskList extends React.Component<TaskProps> {
  componentDidMount() {
    this.props.updateExpandedMyself(true);
  }

  render() {
    const dateFormat = 'MM-DD-YYYY';

    const { RangePicker } = DatePicker;
    return (
      <div className='todo-list'>
        <div className='todo-panel'>
          <RangePicker
            value={[
              moment(
                this.props.startDate
                  ? this.props.startDate
                  : new Date().toLocaleString(),
                dateFormat
              ),
              moment(
                this.props.endDate
                  ? this.props.endDate
                  : new Date().toLocaleString(),
                dateFormat
              )
            ]}
            format={dateFormat}
          />
          <Tooltip placement='top' title='Change Time Zone'>
            <Link to='/settings' style={{ paddingLeft: '30px' }}>
              {this.props.timezone}
            </Link>
          </Tooltip>
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
  timezone: state.myself.timezone,
  startDate: state.myBuJo.startDate,
  endDate: state.myBuJo.endDate
});

export default connect(mapStateToProps, {
  updateExpandedMyself
})(TaskList);
