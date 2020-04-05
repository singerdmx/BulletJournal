import React, { useEffect, useState } from 'react';
import {
  AutoComplete,
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popover,
  Radio,
  Select,
  TimePicker,
  Tooltip,
} from 'antd';
import { EditTwoTone } from '@ant-design/icons';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { patchTask } from '../../features/tasks/actions';
import { IState } from '../../store';
import './modals.styles.less';
import { Transaction } from '../../features/transactions/interface';

const { Option } = Select;

type TransactionProps = {};

interface TransactionEditFormProps {}

const EditTransaction: React.FC<
  RouteComponentProps & TransactionProps & TransactionEditFormProps
> = (props) => {
  return <div>aa</div>;
};

const mapStateToProps = (state: IState) => ({});

export default connect(mapStateToProps, {})(withRouter(EditTransaction));
