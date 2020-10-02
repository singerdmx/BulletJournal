import React from 'react';
import TimezonePicker from './timezone';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ReminderBeforeTaskPicker from './reminder-before-task';
import CurrencyPicker from './currency';
import AvatarUploader from './upload';
import { connect } from 'react-redux';
import { IState } from '../../store';
import {
  patchMyself,
  updateExpandedMyself,
} from '../../features/myself/actions';
import { updateTheme } from './actions';
import './account.styles.less';
import getThemeColorVars from '../../utils/theme';
import { Select, Tooltip } from 'antd';
import {getCookie} from "../../index";

const { Option } = Select;

type AccountProps = {
  originalTheme: string;
  currentTheme: string;
  updateExpandedMyself: (updateSettings: boolean) => void;
  patchMyself: (
    timezone?: string,
    before?: number,
    currency?: string,
    theme?: string
  ) => void;
  updateTheme: (theme: string) => void;
};

declare global {
  interface Window {
    less: any;
  }
}

class Account extends React.Component<AccountProps> {
  componentDidMount() {
      const loginCookie = getCookie('__discourse_proxy');
      if (loginCookie) {
          this.props.updateExpandedMyself(true);
      }
  }

  componentDidUpdate(prevProps: AccountProps): void {
    const currentTheme = this.props.currentTheme;
    if (currentTheme !== prevProps.currentTheme) {
      this.loadUpdatedTheme(currentTheme);
    }
  }

  handleOnThemeChange = (value: string) => {
    this.props.updateTheme(value);
  };

  handleOnThemeClick = (save: boolean) => {
    if (save) {
      this.props.patchMyself(
        undefined,
        undefined,
        undefined,
        this.props.currentTheme
      );
    } else {
      this.props.updateTheme(this.props.originalTheme);
    }
  };

  loadUpdatedTheme = (theme: string) => {
    const vars = getThemeColorVars(theme);
    window.less.modifyVars(vars).then(() => {
      console.log('Theme updated successfully', vars);
    });
  };

  render() {
    return (
      <div>
        <div className="option-container">
          <span>Avatar :</span>
          <AvatarUploader />
        </div>
        <div className="option-container">
          <span>Time Zone :</span> <TimezonePicker />
        </div>
        <div className="option-container">
          <span>Default Reminder Before Task : </span>
          <ReminderBeforeTaskPicker />
        </div>
        <div className="option-container">
          <span>Currency :</span>
          <CurrencyPicker />
        </div>
        <div className="option-container">
          <span>Theme :</span>
          <span>
            <Select
              style={{ width: 80 }}
              placeholder="Select Theme"
              onChange={this.handleOnThemeChange}
              value={this.props.currentTheme}
            >
              <Option key="LIGHT" value="LIGHT">
                Light
              </Option>
              <Option key="DARK" value="DARK">
                Dark
              </Option>
              <Option key="PINK" value="PINK">
                Pink
              </Option>
            </Select>
            <Tooltip placement="top" title="Save">
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
                      : 'hidden',
                }}
              />
            </Tooltip>
            <Tooltip placement="top" title="Cancel">
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
                      : 'hidden',
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
  currentTheme: state.settings.theme,
});

export default connect(mapStateToProps, {
  patchMyself,
  updateExpandedMyself,
  updateTheme,
})(Account);
