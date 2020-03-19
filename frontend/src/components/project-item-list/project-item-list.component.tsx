import React from 'react';
import {DatePicker, Divider, Tooltip} from 'antd';
import moment from 'moment';
import {connect} from 'react-redux';
import {IState} from '../../store';
import {Link} from 'react-router-dom';
import {updateExpandedMyself} from '../../features/myself/actions';
import {dateFormat} from '../../features/myBuJo/constants';
import {getProjectItems, updateMyBuJoDates} from '../../features/myBuJo/actions';
import {ProjectItems} from '../../features/myBuJo/interface';
import ProjectModelItems from "../project-item/project-model-items.component";

const {RangePicker} = DatePicker;

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
      startDate: string,
      endDate: string,
      timezone: string,
      category: string
  ) => void;
};

class ProjectItemList extends React.Component<ProjectItemProps> {
  componentDidMount() {
    this.props.updateExpandedMyself(true);
  }

  handleRangeChange = (dates: any, dateStrings: string[]) => {
    this.props.updateMyBuJoDates(dateStrings[0], dateStrings[1]);
    this.props.getProjectItems(
        dateStrings[0],
        dateStrings[1],
        this.props.timezone,
        'today'
    );
  };

  render() {
    return (
        <div className='todo-list'>
          <div className='todo-panel'>
            <RangePicker
                allowClear={false}
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
              <Link to='/settings' style={{paddingLeft: '30px'}}>
                {this.props.timezone}
              </Link>
            </Tooltip>
          </div>
          <Divider />
          <div>
            <ProjectModelItems projectItems={this.props.projectItems}/>
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
