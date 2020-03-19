import React from 'react';
import TimezonePicker from './timezone';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ReminderBeforeTaskPicker from './reminder-before-task';
import CurrencyPicker from './currency';
import { connect } from 'react-redux';
import { IState } from '../../store';
import {patchMyself, updateExpandedMyself} from '../../features/myself/actions';
import { updateTheme } from './actions';
import './account.styles.less';
import {Select, Tooltip} from "antd";

const { Option } = Select;

type AccountProps = {
  originalTheme: string;
  currentTheme: string;
  updateExpandedMyself: (updateSettings: boolean) => void;
  patchMyself: (timezone?: string, before?: number, currency?: string, theme?: string) => void;
  updateTheme: (theme: string) => void;
};

class Account extends React.Component<AccountProps> {
  componentDidMount() {
    this.props.updateExpandedMyself(true);
  }

  handleOnThemeChange = (value: string) => {
      this.props.updateTheme(value);
  };

  handleOnThemeClick = (save: boolean) => {
    if (save) {
        this.props.patchMyself(undefined, undefined, undefined, this.props.currentTheme);
    } else {
        this.props.updateTheme(this.props.originalTheme);
    }
  };

  render() {
    return (
      <div>
        <div className='option-container'>
          <span>Time Zone &nbsp;&nbsp;&nbsp;</span> <TimezonePicker />
        </div>
        <div className='option-container'>
          <span>Default Reminder Before Task&nbsp;&nbsp;&nbsp;</span>
          <ReminderBeforeTaskPicker />
        </div>
        <div className='option-container'>
          <span>Currency&nbsp;&nbsp;&nbsp;</span>
          <CurrencyPicker />
        </div>
        <div className='option-container'>
          <span>Theme&nbsp;&nbsp;&nbsp;</span>
            <span>
                <Select
                    style={{ width: 80 }}
                    placeholder='Select Theme'
                    onChange={this.handleOnThemeChange}
                    value={this.props.currentTheme}
                >
                    <Option key='LIGHT' value='LIGHT'>Light</Option>
                    <Option key='DARK' value='DARK'>Dark</Option>
                </Select>
                <Tooltip placement='top' title='Save'>
                  <CheckCircleOutlined
                      onClick={() => this.handleOnThemeClick(true)}
                      style={{
                          marginLeft: '20px',
                          cursor: 'pointer',
                          color: '#00e600',
                          fontSize: 20,
                          visibility:
                              this.props.currentTheme !== this.props.originalTheme
                                  ? 'visible'
                                  : 'hidden'
                      }}
                  />
                </Tooltip>
                <Tooltip placement='top' title='Cancel'>
                  <CloseCircleOutlined
                      onClick={() => this.handleOnThemeClick(false)}
                      style={{
                          marginLeft: '20px',
                          cursor: 'pointer',
                          color: '#ff0000',
                          fontSize: 20,
                          visibility:
                              this.props.currentTheme !== this.props.originalTheme
                                  ? 'visible'
                                  : 'hidden'
                      }}
                  />
                </Tooltip>
            </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
    originalTheme: state.myself.theme,
    currentTheme: state.settings.theme
});

export default connect(mapStateToProps, {
  patchMyself,
  updateExpandedMyself,
  updateTheme
})(Account);
