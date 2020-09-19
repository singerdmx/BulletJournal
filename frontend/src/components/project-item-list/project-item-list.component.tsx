import React from 'react';
import { DatePicker, Divider, Tooltip, Select } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { Link } from 'react-router-dom';
import { updateExpandedMyself } from '../../features/myself/actions';
import { dateFormat } from '../../features/myBuJo/constants';
import { updateMyBuJoDates } from '../../features/myBuJo/actions';
import { ProjectItems } from '../../features/myBuJo/interface';
import ProjectModelItems from '../project-item/project-model-items.component';
import { ProjectItemUIType } from "../../features/project/constants";
import TimeZoneAgnosticBigCalendar from '../../utils/react-big-calendar/calendar-wrapper';
import { RouteComponentProps, withRouter } from "react-router";
import {TaskView} from "../../features/tasks/interface";
import {TransactionView} from "../../features/transactions/interface";

type PathProps = RouteComponentProps;

const { Option } = Select;
const { RangePicker } = DatePicker;
const { WeekPicker } = DatePicker;

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

const format = {
  eventTimeRangeFormat: (event: any) => {
    return null;
  }
}

class ProjectItemList extends React.Component<ProjectItemProps & PathProps> {
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
      this.setState({ calendarDate: moment(this.props.startDate).toDate() });
    }
    if (this.state.viewType !== prevState.viewType) {
      this.handleCalendarRangeChange();
    }
  }

  getTaskTimeString = (task: TaskView) => {
    if (!task.startTime) {
      return '';
    }
    if (task.startTime === task.endTime || !task.endTime) {
      return ' ' + moment(task.startTime).format("hh:mm A");
    }

    if (task.endTime - task.startTime >= 86400000) {
      return '';
    }
    return ' ' + moment(task.startTime).format("hh:mm A") + ' - ' + moment(task.endTime).format("hh:mm A");
  }

  getTransactionTimeString = (transaction: TransactionView) => {
    if (!transaction.paymentTime) {
      return '';
    }
    return ' ' + moment(transaction.paymentTime).format("hh:mm A");
  }

  processCalendarEvents = () => {
    let calendarEvents: any[] = [];
    this.props.projectItems.forEach((item, index) => {
      item.tasks.forEach((task, index) => {
        if (task.startTime && task.endTime) {
          calendarEvents.push({
            id: task.id,
            title: task.name + this.getTaskTimeString(task),
            start: new Date(task.startTime),
            end: new Date(task.endTime),
            resource: `/task/${task.id}`,
          });
        }
      });
      item.transactions.forEach((transaction, index) => {
        calendarEvents.push({
          id: transaction.id,
          title: transaction.name + this.getTransactionTimeString(transaction),
          start: new Date(transaction.paymentTime),
          end: new Date(transaction.paymentTime),
          resource: `/transaction/${transaction.id}`
        });
      });
    });
    return this.setState({ calendarEvents });
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
            <TimeZoneAgnosticBigCalendar
              selectable
              toolbar={false}
              events={this.state.calendarEvents}
              timeZoneName={this.props.timezone}
              view={'day'}
              date={this.state.calendarDate}
              onNavigate={this.handleNavigate}
              onView={this.handleViewChange}
              timeslots={1}
              step={60}
              onSelectEvent={(event: any, e: any) => this.props.history.push(event.resource)}
              formats={format}
            />
          </div>);
      case 'week':
        return (
          <TimeZoneAgnosticBigCalendar
            selectable
            toolbar={false}
            events={this.state.calendarEvents}
            timeZoneName={this.props.timezone}
            view={'week'}
            date={this.state.calendarDate}
            onNavigate={this.handleNavigate}
            onView={this.handleViewChange}
            timeslots={1}
            step={60}
            onSelectEvent={(event: any, e: any) => this.props.history.push(event.resource)}
            dayPropGetter={
              (date: any) => {
                return moment(date).format(dateFormat) === moment().format(dateFormat) ? { style: { background: 'rgba(0, 203, 196, 0.12)' } } : {}
              }
            }
            formats={format}
          />);
    }
  };

  handleNavigate = (date: Date) => {
    this.setState({ calendarDate: date });
    this.handleCalendarRangeChange();
  };

  handleViewChange = (view: string) => {
    this.setState({ viewType: view });
    this.handleCalendarRangeChange();
  };

  handleCalendarRangeChange = () => {
    const { calendarDate, viewType } = this.state;
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

  handlePickerChange = (dates: any, dateString: string) => {
    const { viewType } = this.state;

    if (viewType === 'week') {
      this.props.updateMyBuJoDates(
        moment(dateString).startOf(viewType).format(dateFormat),
        moment(dateString).endOf(viewType).format(dateFormat));
    } else if (viewType === 'day') {
      this.props.updateMyBuJoDates(dateString, dateString);
    }
  };

  handlePickerRangeChange = (dates: any, dateStrings: string[]) => {
    this.props.updateMyBuJoDates(dateStrings[0], dateStrings[1]);
  };

  rangePicker = (type: string) => {
    switch (type) {
      case 'agenda':
        return (
          <RangePicker
            style={{ width: '250px' }}
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
          <DatePicker
            style={{ width: '250px' }}
            picker='date'
            allowClear={false}
            showToday={true}
            value={
              moment(
                this.state.calendarDate
                  ? this.state.calendarDate
                  : new Date().toLocaleString('fr-CA'),
                dateFormat
              )}
            format={dateFormat}
            onChange={this.handlePickerChange}
          />);
      case 'week':
        return (
          <WeekPicker
            style={{ width: '250px' }}
            allowClear={false}
            value={
              moment(
                this.state.calendarDate
                  ? this.state.calendarDate
                  : new Date().toLocaleString('fr-CA'),
                dateFormat
              )
            }
            format={dateFormat}
            onChange={this.handlePickerChange}
            renderExtraFooter={
              () =>
                <span style={{
                  color: '#1890ff',
                  background: '#e6f7ff',
                  borderColor: '#91d5ff',
                  padding: '3px',
                  border: '1px solid',
                }} onClick={() => this.props.updateMyBuJoDates(
                  moment().startOf().format(dateFormat),
                  moment().endOf().format(dateFormat))

                }>This Week</span>

            }
          />);
    }
  };

  render() {

    return (
      <div className='todo-list'>
        <div className='todo-panel'>
          <Tooltip title='Choose type of view'>
            <div style={{ paddingRight: '2rem' }}>
              <Select
                defaultValue='agenda'
                style={{ width: 100 }}
                value={this.state.viewType}
                onChange={(value) => this.setState({ viewType: value })}>
                <Option value='agenda'>Agenda</Option>
                <Option value='day'>Day</Option>
                <Option value='week'>Week</Option>
              </Select>
            </div>
          </Tooltip>
          {this.rangePicker(this.state.viewType)}
          <Tooltip placement='top' title='Change Time Zone'>
            <Link to='/settings' style={{ paddingLeft: '30px' }}>
              {this.props.timezone}
            </Link>
          </Tooltip>
        </div>
        <Divider />
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
})(withRouter(ProjectItemList));
