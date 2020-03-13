import React from 'react';
import { Select, Input } from 'antd';
import { DatePicker } from 'antd';
import moment from 'moment';
import { IState } from '../../../../store';
import { connect } from 'react-redux';
import { updateEndString } from '../../actions';
const { Option } = Select;

type EndProps = {
  endDate: string;
  updateEndString: (mode: string, endDate: string, endCount: number) => void;
  endCount: number;
};

type SelectState = {
  value: string;
};

class End extends React.Component<EndProps, SelectState> {
  state: SelectState = {
    value: 'Never'
  };

  onChangeValue = (value: string) => {
    this.setState({ value: value });
    this.props.updateEndString(value, this.props.endDate, this.props.endCount);
  };

  onChangeDate = (date: any, dateString: string) => {
    //only change end date
    this.props.updateEndString(
      this.state.value,
      dateString,
      this.props.endCount
    );
  };

  onChangeCount = (event: any) => {
    //only change end count
    this.props.updateEndString(
      this.state.value,
      this.props.endDate,
      parseInt(event.target.value ? event.target.value : 0)
    );
  };

  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label>
          <strong>End</strong>
        </label>
        <Select
          placeholder='Choose a type'
          style={{ width: '30%' }}
          value={this.state.value}
          onChange={e => this.onChangeValue(e)}
        >
          <Option value='Never'>Never</Option>
          <Option value='After'>After</Option>
          <Option value='On date'>On Date</Option>
        </Select>
        {this.state.value === 'On date' ? (
          <DatePicker
            value={this.props.endDate ? moment(this.props.endDate) : null}
            onChange={this.onChangeDate}
          />
        ) : this.state.value === 'After' ? (
          <div style={{ width: '40%', display: 'flex', alignItems: 'center' }}>
            <Input
              value={this.props.endCount ? this.props.endCount : 0}
              onChange={this.onChangeCount}
            />
            <div>executions.</div>
          </div>
        ) : null}
      </div>
    );
  }
}
const mapStateToProps = (state: IState) => ({
  endDate: state.rRule.endDate,
  endCount: state.rRule.endCount
});
export default connect(mapStateToProps, { updateEndString })(End);
