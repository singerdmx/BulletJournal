import React from 'react';
import { Calendar, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { updateExpandedMyself } from '../../features/myself/actions';
import './bujo-calendar.styles.less';

type BujoCalendarProps = {
  updateExpandedMyself: (updateSettings: boolean) => void;
  timezone: string;
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
        <Calendar />
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  timezone: state.myself.timezone
});

export default connect(mapStateToProps, {
  updateExpandedMyself
})(BujoCalendar);
