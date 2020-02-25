import React from 'react';
import { Select, Icon } from 'antd';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { ReminderBeforeTaskText } from './reducer';
import {
  updateExpandedMyself,
  patchMyself
} from '../../features/myself/actions';
import { updateBefore } from './actions';
const { Option } = Select;

type ReminderBeforeProps = {
  originalBefore: number;
  currentBefore: number;
  updateExpandedMyself: (updateSettings: boolean) => void;
  updateBefore: (before: number) => void;
  patchMyself: (timezone?: string, before?: number) => void;
};

class ReminderBeforeTaskPicker extends React.Component<ReminderBeforeProps> {
  handleOnChange = (value: string) => {
    const before = ReminderBeforeTaskText.indexOf(value);
    this.props.updateBefore(before);
  };

  handleOnClick = (save: boolean) => {
    if (save) {
      this.props.patchMyself(undefined, this.props.currentBefore);
    } else {
      this.props.updateBefore(this.props.originalBefore);
    }
  };

  render() {
    return (
      <span>
        <Select
          showSearch={true}
          style={{ width: 250 }}
          placeholder='Select a before'
          onChange={this.handleOnChange}
          value={ReminderBeforeTaskText[this.props.currentBefore]}
        >
          {ReminderBeforeTaskText.map((before: string, index: number) => (
            <Option key={index} value={before}>
              {before}
            </Option>
          ))}
        </Select>
        <Icon
          type='check-circle'
          onClick={() => this.handleOnClick(true)}
          style={{
            marginLeft: '20px',
            cursor: 'pointer',
            color: '#00e600',
            fontSize: 20,
            visibility:
              this.props.currentBefore !== this.props.originalBefore
                ? 'visible'
                : 'hidden'
          }}
          title='Save'
        />
        <Icon
          type='close-circle'
          onClick={() => this.handleOnClick(false)}
          style={{
            marginLeft: '20px',
            cursor: 'pointer',
            color: '#ff0000',
            fontSize: 20,
            visibility:
              this.props.currentBefore !== this.props.originalBefore
                ? 'visible'
                : 'hidden'
          }}
          title='Cancel'
        />
      </span>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  originalBefore: state.myself.before,
  currentBefore: state.settings.before
});

export default connect(mapStateToProps, {
  updateBefore,
  patchMyself,
  updateExpandedMyself
})(ReminderBeforeTaskPicker);
