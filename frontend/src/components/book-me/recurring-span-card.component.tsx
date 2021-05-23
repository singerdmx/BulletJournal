import {IState} from "../../store";
import {connect} from "react-redux";
import React, {useState} from "react";
import {Modal, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import EditRecurringSpan from "../modals/edit-recurring-span.component";
import {convertToTextWithRRule} from "../../features/recurrence/actions";
import {getDuration} from "../project-item/task-item.component";

type RecurringSpanProps = {
    mode:string,
    recurrenceRule: string,
    duration: number,
    backgroundColor: string,
};

const RecurringSpanCard: React.FC<RecurringSpanProps> = (props) => {
    const {backgroundColor,duration, recurrenceRule,mode} = props;
    const [visible, setVisible] = useState(false);

    const openModal = () => {
        setVisible(true);
    };
    const onCancel = () => {
        setVisible(false);
    };
    const getModal = () => {
        return(
            <Modal
                title="Edit Recurring Span"
                destroyOnClose
                centered
                okText="Update"
                visible={visible}
                onCancel={onCancel}
                // TODO onOk={() => call updateBookingLinkRecurrences api}
            >
                <EditRecurringSpan rRuleString={recurrenceRule} duration={duration}/>
            </Modal>
        )
    }

    const getRule = () => {
        return <div>
            <div>{convertToTextWithRRule(recurrenceRule, false)}</div>
            <div>last {getDuration(duration)}</div>
        </div>
    }

    if (mode == 'add') {
        return <div className="recurring-span-card" style={{backgroundColor: backgroundColor}}>
            <p>Add unavailable time</p>
            {/*TODO call updateBookingLinkRecurrences*/}
        </div>
    }

    return <div className="recurring-span-card" style={{backgroundColor: backgroundColor, color:"white"}}>
        <div className="recurring-span-card-content" >
            <p>{getRule()}</p>
        </div>
        <div className="recurring-span-card-operations">
            <Tooltip title='Edit'>
                <EditOutlined key='Edit' title='Edit' onClick={openModal}/>
            </Tooltip>
            {getModal()}
            <Tooltip title='Delete'>
                <DeleteOutlined key='Delete' title='Delete'
                                //TODO onClick={() => call deleteBookingLink}
                />
            </Tooltip>
        </div>
    </div>
}
const mapStateToProps = (state: IState) => ({
    groups: state.group.groups,
});

export default connect(mapStateToProps, {})
(RecurringSpanCard);
