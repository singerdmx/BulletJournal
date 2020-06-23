import React from 'react';
import {DatePicker, Divider, Radio, Tooltip} from 'antd';
import moment from 'moment';
import {connect} from 'react-redux';
import {IState} from '../../store';
import {Link} from 'react-router-dom';
import {updateExpandedMyself} from '../../features/myself/actions';
import {dateFormat} from '../../features/myBuJo/constants';
import {updateMyBuJoDates} from '../../features/myBuJo/actions';
import {ProjectItems} from '../../features/myBuJo/interface';
import ProjectModelItems from '../project-item/project-model-items.component';
import {ProjectItemUIType} from "../../features/project/constants";
import {Calendar, momentLocalizer} from 'react-big-calendar';
import './project-item-list.styles.less';

const {RangePicker} = DatePicker;
const localizer = momentLocalizer(moment);

type ProjectItemProps = {
  todoSelected: boolean;
  ledgerSelected: boolean;
  timezone: string;
  startDate: string;
  endDate: string;
  projectItems: ProjectItems[];
  updateExpandedMyself: (updateSettings: boolean) => void;
  updateMyBuJoDates: (startDate: string, endDate: string) => void;
};

type ProjectItemCalendarState = {
  viewType: string;
  calendarEvents: any[];
  calendarDate: Date;
};

class ProjectItemList extends React.Component<ProjectItemProps> {
  state: ProjectItemCalendarState = {
    viewType: 'agenda',
    calendarEvents: [],
    calendarDate: moment(this.props.startDate).toDate()
  };

  componentDidMount() {
    this.props.updateExpandedMyself(true);
  }

  componentDidUpdate(prevProps: ProjectItemProps, prevState: ProjectItemCalendarState): void {
    if (this.props.projectItems !== prevProps.projectItems) {
      this.processCalendarEvents();
    }
    if (this.props.startDate !== prevProps.startDate) {
      this.setState({calendarDate: moment(this.props.startDate).toDate()});
    }
    if (this.state.viewType !== prevState.viewType) {
      this.handleCalendarRangeChange();
    }
  }

  processCalendarEvents = () => {
    let calendarEvents: any[] = [];
    this.props.projectItems.map((item, index) => {
      item.tasks.map((task, index) => {
        if (task.dueDate) {
          let dueDate = moment(task.dueDate).toDate();
          if (task.dueTime) {
            dueDate.setHours(parseInt(task.dueTime.split(':')[0], 10));
            dueDate.setMinutes(parseInt(task.dueTime.split(':')[1], 10));
          }
          calendarEvents.push({
            id: task.id,
            title: task.name,
            allDay: task.dueTime ? false : true,
            start: dueDate,
            end: dueDate
          });
        }
      })
    });
    return this.setState({calendarEvents});
  };

  fetchTodayView = (type: string) => {
    switch (type) {
      case 'agenda':
        return (
            <ProjectModelItems
                projectItems={this.props.projectItems}
                completeOnlyOccurrence={true}
                type={ProjectItemUIType.TODAY}
            />);
      case 'day':
        return (
            <div className='rbc-title'>
              <h2>{`${this.state.calendarDate.toDateString()}`}</h2>
              <Calendar
                  selectable
                  toolbar={false}
                  events={this.state.calendarEvents}
                  localizer={localizer}
                  view={'day'}
                  date={this.state.calendarDate}
                  onNavigate={this.handleNavigate}
                  onView={this.handleViewChange}
                  startAccessor='start'
                  endAccessor='end'
                  timeslots={1}
                  step={60}
              />
            </div>);
      case 'week':
        return (
            <Calendar
                selectable
                toolbar={false}
                events={this.state.calendarEvents}
                localizer={localizer}
                view={'week'}
                date={this.state.calendarDate}
                onNavigate={this.handleNavigate}
                onView={this.handleViewChange}
                startAccessor='start'
                endAccessor='end'
                timeslots={1}
                step={60}
            />);
    }
  };

  handleNavigate = (date: Date) => {
    this.setState({calendarDate: date});
    this.handleCalendarRangeChange();
  };

  handleViewChange = (view: string) => {
    this.setState({viewType: view});
    this.handleCalendarRangeChange();
  };

  handleCalendarRangeChange = () => {
    const {calendarDate, viewType} = this.state;
    if (viewType === 'week') {
      this.props.updateMyBuJoDates(
          moment(calendarDate).startOf(viewType).format(dateFormat),
          moment(calendarDate).endOf(viewType).format(dateFormat)
      );
    } else if (viewType === 'day') {
      this.props.updateMyBuJoDates(
          moment(calendarDate).format(dateFormat),
          moment(calendarDate).format(dateFormat)
      );
    }
  };

  handlePickerRangeChange = (dates: any, dateStrings: string[]) => {
    const {viewType} = this.state;
    if (viewType === 'agenda') {
      this.props.updateMyBuJoDates(dateStrings[0], dateStrings[1]);
    } else if (viewType === 'day') {
      this.props.updateMyBuJoDates(dateStrings[0], dateStrings[0]);
    } else if (viewType === 'week') {
      this.props.updateMyBuJoDates(dates[0].startOf(viewType).format(dateFormat), dates[0].endOf(viewType).format(dateFormat));
    }
  };

  rangePicker = (type: string) => {
    switch (type) {
      case 'agenda':
        return (
            <RangePicker
                ranges={{
                  Today: [moment(), moment()],
                  'This Week': [moment().startOf('week'), moment().endOf('week')],
                  'This Month': [
                    moment().startOf('month'),
                    moment().endOf('month'),
                  ],
                }}
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
                  ),
                ]}
                format={dateFormat}
                onChange={this.handlePickerRangeChange}
            />);
      case 'day':
        return (
            <RangePicker
                picker='date'
                ranges={{
                  Today: [moment(), moment()]
                }}
                allowClear={false}
                value={[
                  moment(
                      this.state.calendarDate
                          ? this.state.calendarDate
                          : new Date().toLocaleString('fr-CA'),
                      dateFormat
                  ),
                  moment(
                      this.state.calendarDate
                          ? this.state.calendarDate
                          : new Date().toLocaleString('fr-CA'),
                      dateFormat
                  )
                ]}
                format={dateFormat}
                onChange={this.handlePickerRangeChange}
            />);
      case 'week':
        return (
            <RangePicker
                picker='week'
                ranges={{
                  'This Week': [moment().startOf('week'), moment().endOf('week')]
                }}
                allowClear={false}
                value={[
                  this.state.calendarDate
                      ? moment(this.state.calendarDate).startOf('week')
                      : moment().startOf('week'),
                  this.state.calendarDate
                      ? moment(this.state.calendarDate).endOf('week')
                      : moment().endOf('week')
                ]}
                format={dateFormat}
                onChange={this.handlePickerRangeChange}
            />);
    }
  };

  render() {
    return (
        <div className='todo-list'>
          <div className='todo-panel'>
            {this.rangePicker(this.state.viewType)}
            <Tooltip title='Choose type of view'>
              <Radio.Group
                  style={{paddingLeft: '2rem'}}
                  size='small'
                  buttonStyle='solid'
                  defaultValue='agenda'
                  value={this.state.viewType}
                  onChange={(e) => this.setState({viewType: e.target.value})}
              >
                <Radio.Button value='agenda'>Agenda</Radio.Button>
                <Radio.Button value='day'>Day</Radio.Button>
                <Radio.Button value='week'>Week</Radio.Button>
              </Radio.Group>
            </Tooltip>
            <Tooltip placement='top' title='Change Time Zone'>
              <Link to='/settings' style={{paddingLeft: '30px'}}>
                {this.props.timezone}
              </Link>
            </Tooltip>
          </div>
          <Divider/>
          <div>
            {this.fetchTodayView(this.state.viewType)}
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
  ledgerSelected: state.myBuJo.ledgerSelected,
});

export default connect(mapStateToProps, {
  updateExpandedMyself,
  updateMyBuJoDates,
})(ProjectItemList);
