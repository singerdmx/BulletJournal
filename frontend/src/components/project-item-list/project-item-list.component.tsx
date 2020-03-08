import React from 'react';
import {DatePicker, Tooltip, Divider, Timeline } from 'antd';
import moment from 'moment';
import {connect} from 'react-redux';
import {IState} from '../../store';
import {Link} from 'react-router-dom';
import {updateExpandedMyself} from '../../features/myself/actions';
import {dateFormat} from "../../features/myBuJo/constants";
import {getProjectItems, updateMyBuJoDates} from '../../features/myBuJo/actions';
import {ProjectType} from "../../features/project/constants";
import {ProjectItems} from "../../features/myBuJo/interface";

const { RangePicker } = DatePicker;

type ProjectItemProps = {
  timezone: string;
  startDate: string;
  endDate: string;
  projectItems: ProjectItems[];
  updateExpandedMyself: (updateSettings: boolean) => void;
  updateMyBuJoDates: (startDate: string, endDate: string) => void;
  getProjectItems: (types: ProjectType[], startDate: string, endDate: string, timezone: string) => void;
};

class ProjectItemList extends React.Component<ProjectItemProps> {

  componentDidMount() {
    this.props.updateExpandedMyself(true);
  }

  handleRangeChange = (dates: any, dateStrings: string[]) => {
      this.props.updateMyBuJoDates(dateStrings[0], dateStrings[1]);
      this.props.getProjectItems([ProjectType.LEDGER, ProjectType.TODO], dateStrings[0], dateStrings[1],
          this.props.timezone);
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
              <Timeline mode={"left"}>
                  {
                      this.props.projectItems.map((items, index) => {
                          return (
                              <Timeline.Item label={items.date}>
                                  {items.dayOfWeek}
                              </Timeline.Item>);
                      })
                  }
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
  projectItems: state.myBuJo.projectItems
});

export default connect(mapStateToProps, {
  updateExpandedMyself, updateMyBuJoDates, getProjectItems
})(ProjectItemList);
