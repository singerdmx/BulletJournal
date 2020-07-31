import React from 'react';
import {DatePicker, InputNumber, Select} from 'antd';
import moment from 'moment';
import {IState} from '../../../../store';
import {connect} from 'react-redux';
import {updateEndString} from '../../actions';
import {defaultDate, End as EndType} from '../../reducer';

const {Option} = Select;

type EndProps = {
  updateEndString: (endDate: string | null, endCount: number | null) => void;
  end: EndType;
};

type SelectState = {
  value: string;
};

class End extends React.Component<EndProps, SelectState> {
  state: SelectState = {
    value: this.props.end.count ? 'After' : (this.props.end.until ? 'On date' : 'Never'),
  };

  onChangeValue = (value: string) => {
    this.setState({value: value});
    if (value === 'After') {
      this.props.updateEndString(null, 1);
    } else if (value === 'On date') {
      this.props.updateEndString(defaultDate, null);
    } else {
      this.props.updateEndString(null, null);
    }
  };

  onChangeDate = (date: any, dateString: string) => {
    //only change end date
    this.props.updateEndString(
        dateString,
        null
    );
  };

  onChangeCount = (event: any) => {
    if (isNaN(event)) {
      event = 1;
    }
    //only change end count
    this.props.updateEndString(
        null,
        parseInt(event)
    );
  };

  render() {
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
          <label style={{marginRight: '1em'}}>
            <strong>End :</strong>
          </label>
          <Select
              placeholder="Choose a type"
              style={{width: '30%'}}
              value={this.state.value}
              onChange={(e) => this.onChangeValue(e)}
          >
            <Option value="Never">Never</Option>
            <Option value="After">After</Option>
            <Option value="On date">On Date</Option>
          </Select>
          {this.state.value === 'On date' ? (
              <DatePicker
                  value={moment(this.props.end.until ? this.props.end.until : defaultDate)}
                  onChange={this.onChangeDate}
                  allowClear={false}
              />
          ) : this.state.value === 'After' ? (
              <div style={{width: '40%', display: 'flex', alignItems: 'center'}}>
                <InputNumber
                    style={{ width: '50px' }}
                    value={this.props.end.count ? this.props.end.count : 1}
                    onChange={this.onChangeCount}
                />
                <div style={{paddingLeft: '6px'}}>time(s)</div>
              </div>
          ) : null}
        </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  end: state.rRule.end,
});
export default connect(mapStateToProps, {updateEndString})(End);
