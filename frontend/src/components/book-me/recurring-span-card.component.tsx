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
    recurrenceRule: string,
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
    const {link, backgroundColor, duration, recurrenceRule, mode, index,
        updateRruleString, updateBookingLinkRecurrences} = props;
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
                title="Do not schedule for the following time"
                destroyOnClose
                centered
                okText={mode === 'add' ? 'Block this on calendar' : 'Update'}
                visible={visible}
                onCancel={onCancel}
                // TODO onOk={() => call updateBookingLinkRecurrences api}
            >
                <EditRecurringSpan duration={duration}/>
            </Modal>
        )
    }

    const getRule = () => {
        if (mode === 'add') {
            return <div>Add unavailable time</div>
        }
        return <div>
            <div>{convertToTextWithRRule(recurrenceRule, false)}</div>
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

    return <div>
        {getModal()}
        <div
            key={index}
            className="recurring-span-card"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (recurrenceRule) {
                    updateRruleString(recurrenceRule);
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
    link: state.bookingReducer.link
});

export default connect(mapStateToProps, {
    updateRruleString,
    updateBookingLinkRecurrences
})
(RecurringSpanCard);
