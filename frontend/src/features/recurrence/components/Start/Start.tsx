import React from 'react';
import { DatePicker } from 'antd';
//used for redux
import { IState } from '../../../../store';
import { connect } from 'react-redux';
import { updateStartString } from '../../actions';
import moment from 'moment';

type StartProps = {
  timezone: string;
  startDate: string;
  updateStartString: (startDate: string) => void;
};

class Start extends React.Component<StartProps> {
  componentDidMount = () => {
    const initStartDate = moment(
      new Date().toLocaleString(
        'fr-CA',
        this.props.timezone ? { timeZone: this.props.timezone } : {}
      ),
      'YYYY-MM-DD'
    ).format('YYYY-MM-DD');
    this.props.updateStartString(initStartDate);
  };

  onChange = (date: any, dateString: string) => {
    this.props.updateStartString(dateString);
  };

  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ marginRight: '1em' }}>
          <strong>Start :</strong>
        </label>
        <DatePicker
          value={this.props.startDate ? moment(this.props.startDate) : null}
          onChange={this.onChange}
          allowClear={false}
        />
      </div>
    );
  }
}
const mapStateToProps = (state: IState) => ({
  startDate: state.rRule.startDate,
  timezone: state.settings.timezone
});

export default connect(mapStateToProps, { updateStartString })(Start);
