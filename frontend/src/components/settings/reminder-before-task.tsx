import React from 'react';
import { Select, Icon } from 'antd';
import { connect } from 'react-redux';
import { IState } from '../../store';

const { Option } = Select;

type ReminderBeforeTaskProps = {
}

class ReminderBeforeTaskPicker extends React.Component<ReminderBeforeTaskProps> {
    render() {
        return (
            <span></span>
        );
    }
}

const mapStateToProps = (state: IState) => ({});

export default connect(mapStateToProps, {})(ReminderBeforeTaskPicker);