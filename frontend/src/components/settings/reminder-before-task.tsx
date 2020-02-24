import React from 'react';
import { Select, Icon } from 'antd';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { ReminderBeforeTaskText } from './reducer';
import { Before } from '../../features/myself/reducer';
import {
  updateBefore,
  updateExpandedMyself,
  patchMyself
} from '../../features/myself/actions';
import { updateBeforeSaveButtonVisiblility } from './actions';
const { Option } = Select;

type ReminderBeforeProps = {
  before: Before;
  beforeSaveButtonVisible: boolean;
  updateExpandedMyself: () => void;
  updateBefore: (before: Before) => void;
  patchMyself: () => void;
  updateBeforeSaveButtonVisiblility: (beforeSaveButtonVisible: boolean) => void;
};

class ReminderBeforeTaskPicker extends React.Component<ReminderBeforeProps> {
  handleOnChange = (value: string) => {
    const index = ReminderBeforeTaskText.indexOf(value);
    const before: Before = {
      text: value,
      value: index
    };
    this.props.updateBefore(before);
    this.props.updateBeforeSaveButtonVisiblility(true);
  };

  handleOnClick = (save: boolean) => {
    this.props.updateBeforeSaveButtonVisiblility(false);
    if (save) {
      this.props.patchMyself();
    } else {
      this.props.updateExpandedMyself();
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
          value={this.props.before.text}
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
            visibility: this.props.beforeSaveButtonVisible
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
            visibility: this.props.beforeSaveButtonVisible
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
  before: state.myself.before,
  beforeSaveButtonVisible: state.settings.beforeSaveButtonVisible
});

export default connect(mapStateToProps, {
  updateBefore,
  patchMyself,
  updateBeforeSaveButtonVisiblility,
  updateExpandedMyself
})(ReminderBeforeTaskPicker);
