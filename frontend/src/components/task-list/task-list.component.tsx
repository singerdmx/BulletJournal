import React from 'react';
import TodoItem from '../../components/todo-item/todo-item.component';
import { List, DatePicker, Tooltip } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { Link } from 'react-router-dom';
import { updateExpandedMyself } from '../../features/myself/actions';
import { dateFormat } from "../../features/myBuJo/constants";
import { updateMyBuJoDates } from '../../features/myBuJo/actions';

type TaskProps = {
  data: string[];
  timezone: string;
  startDate: string;
  endDate: string;
  updateExpandedMyself: (updateSettings: boolean) => void;
  updateMyBuJoDates: (startDate: string, endDate: string) => void;
};

class TaskList extends React.Component<TaskProps> {
  componentDidMount() {
    this.props.updateExpandedMyself(true);
  }

  handleRangeChange = (dates: any, dateStrings: string[]) => {
      console.log(dates);
      console.log(dateStrings);
      this.props.updateMyBuJoDates(dateStrings[0], dateStrings[1]);
  };

  render() {
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
            onChange={this.handleRangeChange}
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
  updateExpandedMyself, updateMyBuJoDates
})(TaskList);
