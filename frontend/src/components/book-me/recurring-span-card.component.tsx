import {IState} from "../../store";
import {connect} from "react-redux";
import React, {useState} from "react";
import {Modal, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, PlusCircleOutlined} from "@ant-design/icons";
import EditRecurringSpan from "../modals/edit-recurring-span.component";
import {convertToTextWithRRule, updateRruleString} from "../../features/recurrence/actions";
import {getDuration} from "../project-item/task-item.component";
import {updateBookingLinkRecurrences} from "../../features/bookingLink/actions";
import {BookingLink, RecurringSpan} from "../../features/bookingLink/interface";

type RecurringSpanProps = {
    link: undefined | BookingLink,
    mode:string,
    originalRecurrenceRule: string,
    rRuleString: string,
    duration: number,
    backgroundColor: string,
    index: number,
    updateRruleString: (rruleString: string) => void;
    updateBookingLinkRecurrences: (
        bookingLinkId: string,
        recurrences: RecurringSpan[],
        timezone: string,
    ) => void;
};

const RecurringSpanCard: React.FC<RecurringSpanProps> = (props) => {
    const {link, backgroundColor, duration, originalRecurrenceRule, mode, index, rRuleString,
        updateRruleString, updateBookingLinkRecurrences} = props;
    const [visible, setVisible] = useState(false);
    const [last, setLast] = useState(duration % 60 === 0 ? (duration / 60).toString() : duration.toString());
    const [unit, setUnit] = useState(duration % 60 === 0 ? 'Hours' : 'Minutes');

    const openModal = () => {
        setVisible(true);
    };
    const onCancel = () => {
        setVisible(false);
    };
    const getModal = () => {
        return(
            <Modal
                title="Do not schedule for the following time"
                destroyOnClose
                centered
                okText={mode === 'add' ? 'Block this on calendar' : 'Update'}
                visible={visible}
                onCancel={onCancel}
                onOk={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (link) {
                        const recurrences: RecurringSpan[] = [...link.recurrences];
                        const recurrence: RecurringSpan = {
                            duration: parseInt(last) * (unit === 'Hours' ? 60 : 1),
                            recurrenceRule: rRuleString
                        };
                        if (mode === 'add') {
                            recurrences.unshift(recurrence);
                        } else {
                            recurrences[index] = recurrence;
                        }
                        updateBookingLinkRecurrences(link.id, recurrences, link.timezone);
                    }
                    setVisible(false);
                }}
            >
                <EditRecurringSpan last={last} unit={unit} setLast={setLast} setUnit={setUnit}/>
            </Modal>
        )
    }

    const getRule = () => {
        if (mode === 'add') {
            return <div>Add unavailable time</div>
        }
        return <div>
            <div>{convertToTextWithRRule(originalRecurrenceRule, false)}</div>
            <div>last {getDuration(duration)}</div>
        </div>
    }

    function getOperationDiv() {
        if (mode === 'add') {
            return <>
                <PlusCircleOutlined style={{fontSize: '30px'}}/>
            </>
        }
        return <>
            <Tooltip title='Edit'>
                <EditOutlined key='Edit' title='Edit'/>
            </Tooltip>
            <Tooltip title='Delete'>
                <DeleteOutlined
                    key='Delete' title='Delete'
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (link) {
                            const recurrences : RecurringSpan[] = [...link.recurrences];
                            recurrences.splice(index, 1);
                            updateBookingLinkRecurrences(link.id, recurrences, link.timezone);
                        }
                    }}
                />
            </Tooltip>
        </>;
    }

    return <div key={`k${index}`}>
        {getModal()}
        <div
            key={index}
            className="recurring-span-card"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (originalRecurrenceRule) {
                    updateRruleString(originalRecurrenceRule);
                }
                openModal();
            }}
            style={{backgroundColor: backgroundColor, color: "white"}}>
            <div className="recurring-span-card-content">
                {getRule()}
            </div>
            <div className="recurring-span-card-operations">
                {getOperationDiv()}
            </div>
        </div>
    </div>
}
const mapStateToProps = (state: IState) => ({
    groups: state.group.groups,
    link: state.bookingReducer.link,
    rRuleString: state.rRule.rRuleString,
});

export default connect(mapStateToProps, {
    updateRruleString,
    updateBookingLinkRecurrences
})(RecurringSpanCard);
