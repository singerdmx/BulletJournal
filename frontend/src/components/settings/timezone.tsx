import React from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Select, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { IState } from '../../store';
import {
  updateExpandedMyself,
  patchMyself
} from '../../features/myself/actions';
import { updateTimezone } from './actions';
import { zones } from './constants';

const { Option } = Select;

const currentZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const currentCountry = currentZone && currentZone.split('/')[0];
zones.sort((a, b) => {
  if (currentZone && currentZone === a) {
    return -1;
  }
  if (
    currentCountry &&
    a.includes(currentCountry) &&
    !b.includes(currentCountry)
  ) {
    return -1;
  }
  return 0;
});

type TimezoneProps = {
  originalTimezone: string;
  currentTimezone: string;
  updateExpandedMyself: (updateSettings: boolean) => void;
  updateTimezone: (timezone: string) => void;
  patchMyself: (timezone?: string, before?: number, currency?: string, theme?: string) => void;
};

class TimezonePicker extends React.Component<TimezoneProps> {
  handleOnChange = (value: string) => {
    this.props.updateTimezone(value);
  };

  handleOnClick = (save: boolean) => {
    if (save) {
      this.props.patchMyself(this.props.currentTimezone);
    } else {
      this.props.updateTimezone(this.props.originalTimezone);
    }
  };

  render() {
    return (
      <span>
        <Select
          showSearch={true}
          style={{ width: 250 }}
          placeholder='Select Time Zone'
          onChange={this.handleOnChange}
          value={this.props.currentTimezone}
        >
          {zones.map((zone: string, index: number) => (
            <Option key={zone} value={zone} title={zone}>
              {zone}
            </Option>
          ))}
        </Select>
        <Tooltip placement='top' title='Save'>
          <CheckCircleOutlined
            onClick={() => this.handleOnClick(true)}
            style={{
              marginLeft: '20px',
              cursor: 'pointer',
              color: '#00e600',
              fontSize: 20,
              visibility:
                this.props.currentTimezone !== this.props.originalTimezone
                  ? 'visible'
                  : 'hidden'
            }}
          />
        </Tooltip>
        <Tooltip placement='top' title='Cancel'>
          <CloseCircleOutlined
            onClick={() => this.handleOnClick(false)}
            style={{
              marginLeft: '20px',
              cursor: 'pointer',
              color: '#ff0000',
              fontSize: 20,
              visibility:
                this.props.currentTimezone !== this.props.originalTimezone
                  ? 'visible'
                  : 'hidden'
            }}
          />
        </Tooltip>
      </span>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  originalTimezone: state.myself.timezone,
  currentTimezone: state.settings.timezone
});

export default connect(mapStateToProps, {
  updateTimezone,
  patchMyself,
  updateExpandedMyself
})(TimezonePicker);
