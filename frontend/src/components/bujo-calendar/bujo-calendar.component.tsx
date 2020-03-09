import React from 'react';
import { Calendar, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { IState } from '../../store';
import moment from 'moment';
import { updateExpandedMyself } from '../../features/myself/actions';
import { dateFormat } from '../../features/myBuJo/constants';
import './bujo-calendar.styles.less';

type BujoCalendarProps = {
  startDate: string;
  timezone: string;
  updateExpandedMyself: (updateSettings: boolean) => void;
};

class BujoCalendar extends React.Component<BujoCalendarProps> {
  componentDidMount() {
    this.props.updateExpandedMyself(true);
  }

  render() {
    return (
      <div className='bujo-calendar'>
        <div className='timezone-container'>
          <Tooltip placement='top' title='Change Time Zone'>
            <Link to='/settings'>{this.props.timezone}</Link>
          </Tooltip>
        </div>
        <Calendar value={moment(
                this.props.startDate
                  ? this.props.startDate
                  : new Date().toLocaleString('fr-CA'),
                dateFormat
              )}/>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  timezone: state.myself.timezone,
  startDate: state.myBuJo.startDate,
});

export default connect(mapStateToProps, {
  updateExpandedMyself
})(BujoCalendar);
