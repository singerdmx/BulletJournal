import React from 'react';
import TodoItem from '../../components/todo-item/todo-item.component';
import {DatePicker, List, Tooltip} from 'antd';
import moment from 'moment';
import {connect} from 'react-redux';
import {IState} from '../../store';
import {Link} from 'react-router-dom';
import {updateExpandedMyself} from '../../features/myself/actions';
import {dateFormat} from "../../features/myBuJo/constants";
import {getProjectItems, updateMyBuJoDates} from '../../features/myBuJo/actions';
import {ProjectType} from "../../features/project/constants";
import {ProjectItems} from "../../features/myBuJo/interface";

type TaskProps = {
  data: string[];
  timezone: string;
  startDate: string;
  endDate: string;
  projectItems: ProjectItems[];
  updateExpandedMyself: (updateSettings: boolean) => void;
  updateMyBuJoDates: (startDate: string, endDate: string) => void;
  getProjectItems: (types: ProjectType[], startDate: string, endDate: string, timezone: string) => void;
};

class TaskList extends React.Component<TaskProps> {
  componentDidMount() {
    this.props.updateExpandedMyself(true);
  }

  handleRangeChange = (dates: any, dateStrings: string[]) => {
      console.log(dates);
      console.log(dateStrings);
      this.props.updateMyBuJoDates(dateStrings[0], dateStrings[1]);
      this.props.getProjectItems([ProjectType.LEDGER, ProjectType.TODO], dateStrings[0], dateStrings[1],
          this.props.timezone);
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
  endDate: state.myBuJo.endDate,
  projectItems: state.myBuJo.projectItems
});

export default connect(mapStateToProps, {
  updateExpandedMyself, updateMyBuJoDates, getProjectItems
})(TaskList);
