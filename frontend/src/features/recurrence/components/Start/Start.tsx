import React from 'react';
import { DatePicker } from 'antd';
//used for redux
import { IState } from '../../../../store';
import { connect } from 'react-redux';
import { updateStartString } from '../../actions';
import moment from 'moment';

type StartProps = {
  startDate: string;
  updateStartString: (startDate: string) => void;
};

class Start extends React.Component<StartProps> {
  onChange = (date: any, dateString: string) => {
    this.props.updateStartString(dateString);
  };

  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label>
          <strong>Start</strong>
        </label>
        <DatePicker
          value={this.props.startDate ? moment(this.props.startDate) : null}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
const mapStateToProps = (state: IState) => ({
  startDate: state.rRule.startDate
});

export default connect(mapStateToProps, { updateStartString })(Start);
