import React from 'react';
import { Calendar, Tooltip, Popover, Badge } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { IState } from '../../store';
import moment from 'moment';
import {
  CarryOutOutlined,
  FileTextOutlined,
  AccountBookOutlined,
} from '@ant-design/icons';
import { updateExpandedMyself } from '../../features/myself/actions';
import { dateFormat } from '../../features/myBuJo/constants';
import { ProjectItems } from '../../features/myBuJo/interface';
import {
  getProjectItems,
  calendarModeReceived,
  updateSelectedCalendarDay
} from '../../features/myBuJo/actions';
import './bujo-calendar.styles.less';
import { CalendarMode } from 'antd/lib/calendar/generateCalendar';

type BujoCalendarProps = {
  selectedCalendarDay: string;
  timezone: string;
  calendarMode: string;
  projectItems: ProjectItems[];
  updateExpandedMyself: (updateSettings: boolean) => void;
  calendarModeReceived: (calendarMode: string) => void;
  updateSelectedCalendarDay: (selectedCalendarDay: string) => void;
  getProjectItems: (
    startDate: string,
    endDate: string,
    timezone: string,
    category: string
  ) => void;
};

class BujoCalendar extends React.Component<BujoCalendarProps> {
  componentDidMount() {
    this.props.updateExpandedMyself(true);
  }

  dateCellRender = (value: moment.Moment) => {
    const target = this.props.projectItems
      .filter((p: ProjectItems) => p.date === value.format(dateFormat));
    if (target.length === 0) {
      return null;
    }

    const targetDay = target[0];
    const content =(
      <div>
          {targetDay.notes.map(n => <div key={`notes${n.id}`}><Badge><FileTextOutlined />&nbsp;{n.name}</Badge></div>)}
          {targetDay.tasks.map(t => <div key={`tasks${t.id}`}><Badge><CarryOutOutlined />&nbsp;{t.name}</Badge></div>)}
          {targetDay.transactions.map(t => <div key={`transactions${t.id}`}><Badge><AccountBookOutlined />&nbsp;{t.name}</Badge></div>)}
      </div>
    );
    return (
      <Popover content={content}
        title={`${targetDay.date} ${targetDay.dayOfWeek}`}>
        {content}
      </Popover>);
  };

  monthCellRender = (value: moment.Moment) => {
    const title = value.format("YYYY-MM");
    const targets = this.props.projectItems
      .filter((p: ProjectItems) => p.date.substring(0, 7) === title);
    if (targets.length === 0) {
      return null;
    }

    const content = (
      <div>
        {
          targets.map((targetDay: ProjectItems, index: number) => {
            return (<div key={`bujo${index}`}>
              {targetDay.notes.map(n => <div key={`notes${n.id}`}><Badge><FileTextOutlined />&nbsp;{n.name}</Badge></div>)}
              {targetDay.tasks.map(t => <div key={`tasks${t.id}`}><Badge><CarryOutOutlined />&nbsp;{t.name}</Badge></div>)}
              {targetDay.transactions.map(t => <div key={`transactions${t.id}`}><Badge><AccountBookOutlined />&nbsp;{t.name}</Badge></div>)}
            </div>)
          })
        }
      </div>
    );
    return (<Popover content={content}
      title={title}>
      {content}
    </Popover>);
  }

  onPanelChange = (value: moment.Moment, mode: CalendarMode) => {
    const modeChanged = this.props.calendarMode !== mode;
    this.props.calendarModeReceived(mode);
    const date = value.format(dateFormat);
    const monthChanged = date.substring(0, 7) !== this.props.selectedCalendarDay.substring(0, 7);
    const yearChanged = date.substring(0, 4) !== this.props.selectedCalendarDay.substring(0, 4);
    this.props.updateSelectedCalendarDay(date);
    if (mode === 'month') {
      if (!modeChanged && !monthChanged) {
        console.log('month unchanged');
        return;
      }
      this.props.getProjectItems(
        value.add(-60, 'days').format(dateFormat),
        value.add(120, 'days').format(dateFormat), // because it deducts 60 first
        this.props.timezone, 'calendar');
    } else { // mode is 'year'
        const year = value.format(dateFormat).substring(0, 4);
        if (!modeChanged && !yearChanged) {
          console.log('year unchanged');
          return;
        }
        this.props.getProjectItems(
          year + '-01-01',
          year + '-12-31', // for the whole year
          this.props.timezone, 'calendar');
    }
  };

  render() {
    var mode : CalendarMode = this.props.calendarMode as CalendarMode;
    return (
      <div className='bujo-calendar'>
        <div className='timezone-container'>
          <Tooltip placement='top' title='Change Time Zone'>
            <Link to='/settings'>{this.props.timezone}</Link>
          </Tooltip>
        </div>
        <Calendar
          dateCellRender={(date) => this.dateCellRender(date)}
          onPanelChange={(date, mode) => this.onPanelChange(date, mode)}
          monthCellRender={(date) => this.monthCellRender(date)}
          mode={mode}
          value={moment(
            this.props.selectedCalendarDay
              ? this.props.selectedCalendarDay
              : new Date().toLocaleString('fr-CA'),
            dateFormat
          )}/>
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
  updateSelectedCalendarDay
})(BujoCalendar);
