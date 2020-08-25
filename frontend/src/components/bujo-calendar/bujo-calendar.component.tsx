import React from 'react';
import { Calendar, Tooltip, Popover, Badge } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { IState } from '../../store';
import moment from 'moment';
import {
  CarryOutOutlined,
  FileTextOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';
import { updateExpandedMyself } from '../../features/myself/actions';
import { dateFormat } from '../../features/myBuJo/constants';
import { ProjectItems } from '../../features/myBuJo/interface';
import {
  getProjectItems,
  calendarModeReceived,
  updateSelectedCalendarDay,
  updateMyBuJoDates,
} from '../../features/myBuJo/actions';
import './bujo-calendar.styles.less';
import { CalendarMode } from 'antd/lib/calendar/generateCalendar';
import { iconMapper } from '../side-menu/side-menu.component';
import { ProjectType } from '../../features/project/constants';

type PathProps = RouteComponentProps;

type BujoCalendarProps = {
  selectedCalendarDay: string;
  timezone: string;
  calendarMode: string;
  projectItems: ProjectItems[];
  updateExpandedMyself: (updateSettings: boolean) => void;
  calendarModeReceived: (calendarMode: string) => void;
  updateSelectedCalendarDay: (selectedCalendarDay: string) => void;
  updateMyBuJoDates: (startDate: string, endDate: string) => void;
  getProjectItems: (
    startDate: string,
    endDate: string,
    timezone: string,
    category: string
  ) => void;
};

class BujoCalendar extends React.Component<BujoCalendarProps & PathProps> {
  state = {
    selectedValue: moment(
      this.props.selectedCalendarDay
        ? this.props.selectedCalendarDay
        : new Date().toLocaleString('fr-CA'),
      dateFormat
    ),
  };

  componentDidMount() {
    this.props.updateExpandedMyself(true);
  }

  onClickMonthProjectItem = (value: moment.Moment) => {
    const dateString = value.format(dateFormat);
    this.props.history.push('/bujo/today');
    this.props.updateMyBuJoDates(dateString, dateString);
  };

  onClickYearProjectItem = (value: moment.Moment) => {
    const firstDayString = value.format('YYYY-MM-01');
    const lastDayString = moment(firstDayString, dateFormat)
      .add(1, 'month')
      .subtract(1, 'day')
      .format(dateFormat);

    this.props.history.push('/bujo/today');
    this.props.updateMyBuJoDates(firstDayString, lastDayString);
  };

  dateCellRender = (value: moment.Moment) => {
    const target = this.props.projectItems.filter(
      (p: ProjectItems) => p.date === value.format(dateFormat)
    );
    if (target.length === 0) {
      return (
        <div
          style={{ height: '100%', width: '100%' }}
          onClick={() => {
            this.onClickMonthProjectItem(value);
          }}
        />
      );
    }

    const targetDay = target[0];

    const content = (
      <div
        style={{ height: '100%', width: '100%' }}
        onClick={() => {
          this.onClickMonthProjectItem(value);
        }}
      >
        {targetDay.notes.map((n) => (
          <div key={`notes${n.id}`}>
            <div style={{ display: 'flex' }}>
              <Badge>
                <FileTextOutlined />
                &nbsp;{n.name}
              </Badge>
            </div>
          </div>
        ))}
        {targetDay.tasks.map((t) => (
          <div key={`tasks${t.id}`}>
            <Badge>
              <div style={{ display: 'flex' }}>
                <CarryOutOutlined />
                &nbsp;{t.name}&nbsp;{t.dueTime ? t.dueTime : ''}
              </div>
            </Badge>
          </div>
        ))}
        {targetDay.transactions.map((t) => (
          <div key={`transactions${t.id}`}>
            <Badge>
              <div style={{ display: 'flex' }}>
                <CreditCardOutlined />
                &nbsp;{t.name}&nbsp;{t.time ? t.time : ''}
              </div>
            </Badge>
          </div>
        ))}
      </div>
    );
    return (
      <Popover
        content={content}
        title={`${targetDay.date} ${targetDay.dayOfWeek}`}
      >
        <div style={{ height: '100%', width: '100%' }}>{content}</div>
      </Popover>
    );
  };

  monthCellRender = (value: moment.Moment) => {
    const title = value.format('YYYY-MM');
    const targets = this.props.projectItems.filter(
      (p: ProjectItems) => p.date.substring(0, 7) === title
    );
    if (targets.length === 0) {
      return (
        <div
          style={{ height: '100%', width: '100%' }}
          onClick={() => this.onClickYearProjectItem(value)}
        />
      );
    }

    const content = (
      <div
        style={{ height: '100%', width: '100%' }}
        onClick={() => this.onClickYearProjectItem(value)}
      >
        {targets.map((targetDay: ProjectItems, index: number) => {
          return (
            <div
              key={`bujo${index}`}
              style={{ height: '100%', width: '100%' }}
              onClick={() => this.onClickYearProjectItem(value)}
            >
              {targetDay.notes.map((n) => (
                <div key={`notes${n.id}`}>
                  <Badge>
                    {iconMapper[ProjectType.NOTE]}&nbsp;{n.name}&nbsp;
                  </Badge>
                </div>
              ))}
              {targetDay.tasks.map((t) => (
                <div key={`tasks${t.id}`}>
                  <Badge>
                    {iconMapper[ProjectType.TODO]}&nbsp;{t.name}&nbsp;
                    {t.dueDate ? t.dueDate : ''}
                    {t.dueTime ? ' ' + t.dueTime : ''}
                  </Badge>
                </div>
              ))}
              {targetDay.transactions.map((t) => (
                <div key={`transactions${t.id}`}>
                  <Badge>
                    {iconMapper[ProjectType.LEDGER]}&nbsp;{t.name}&nbsp;
                    {t.date ? t.date : ''}
                    {t.time ? ' ' + t.time : ''}
                  </Badge>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
    return (
      <Popover content={content} title={title}>
        <div style={{ height: '100%', width: '100%' }}>{content}</div>
      </Popover>
    );
  };

  onPanelChange = (value: moment.Moment, mode: CalendarMode) => {
    this.setState({
      selectedValue: value,
    });

    value = value.clone();
    const modeChanged = this.props.calendarMode !== mode;
    this.props.calendarModeReceived(mode);
    const date = value.format(dateFormat);
    const monthChanged =
      date.substring(0, 7) !== this.props.selectedCalendarDay.substring(0, 7);
    const yearChanged =
      date.substring(0, 4) !== this.props.selectedCalendarDay.substring(0, 4);
    this.props.updateSelectedCalendarDay(date);
    if (mode === 'month') {
      if (!modeChanged && !monthChanged) {
        console.log('month unchanged');
        return;
      }

      this.props.getProjectItems(
        value.add(-60, 'days').format(dateFormat),
        value.add(120, 'days').format(dateFormat), // because it deducts 60 first
        this.props.timezone,
        'calendar'
      );
    } else {
      // mode is 'year'
      const year = value.format(dateFormat).substring(0, 4);
      if (!modeChanged && !yearChanged) {
        console.log('year unchanged');
        return;
      }
      this.props.getProjectItems(
        year + '-01-01',
        year + '-12-31', // for the whole year
        this.props.timezone,
        'calendar'
      );
    }
  };

  render() {
    const { selectedValue } = this.state;
    const mode: CalendarMode = this.props.calendarMode as CalendarMode;
    return (
      <div className='bujo-calendar'>
        <div className='timezone-container'>
          <Tooltip placement='top' title='Change Time Zone'>
            <Link to='/settings'>{this.props.timezone}</Link>
          </Tooltip>
        </div>
        <Calendar
          dateCellRender={this.dateCellRender}
          monthCellRender={this.monthCellRender}
          onPanelChange={this.onPanelChange}
          mode={mode}
          value={selectedValue}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  timezone: state.myself.timezone,
  selectedCalendarDay: state.myBuJo.selectedCalendarDay,
  calendarMode: state.myBuJo.calendarMode,
  projectItems: state.myBuJo.projectItemsForCalendar,
});

export default connect(mapStateToProps, {
  updateExpandedMyself,
  calendarModeReceived,
  getProjectItems,
  updateSelectedCalendarDay,
  updateMyBuJoDates,
})(withRouter(BujoCalendar));
