import React from 'react';
import moment from "moment";
import {dateFormat} from "../../features/myBuJo/constants";
import {DatePicker, Divider, Tooltip} from "antd";
import {Link} from "react-router-dom";
import {IState} from "../../store";
import {connect} from "react-redux";
import {updateRecentItemsDates} from "../../features/recent/actions";

const {RangePicker} = DatePicker;

type RecentItemProps = {
    todoSelected: boolean;
    ledgerSelected: boolean;
    noteSelected: boolean;
    timezone: string;
    startDate: string;
    endDate: string;
    updateRecentItemsDates: (startDate: string, endDate: string) => void;
};

const RecentItemList: React.FC<RecentItemProps> = (
    {
        todoSelected,
        ledgerSelected,
        noteSelected,
        timezone,
        startDate,
        endDate,
        updateRecentItemsDates
    }) => {

    const handleRangeChange = (dates: any, dateStrings: string[]) => {
        updateRecentItemsDates(dateStrings[0], dateStrings[1]);
    };

    return <div>
        <div className="todo-panel">
            <RangePicker
                ranges={{
                    Today: [moment(), moment()],
                    'This Week': [moment().startOf('week'), moment().endOf('week')],
                    'This Month': [
                        moment().startOf('month'),
                        moment().endOf('month'),
                    ],
                }}
                allowClear={false}
                value={[
                    moment(startDate, dateFormat),
                    moment(endDate, dateFormat),
                ]}
                format={dateFormat}
                onChange={handleRangeChange}
            />
            <Tooltip placement="top" title="Change Time Zone">
                <Link to="/settings" style={{paddingLeft: '30px'}}>
                    {timezone}
                </Link>
            </Tooltip>
        </div>
        <Divider/>
        <div>
        </div>
    </div>
};

const mapStateToProps = (state: IState) => ({
    timezone: state.myself.timezone,
    startDate: state.recent.startDate,
    endDate: state.recent.endDate,
    todoSelected: state.myBuJo.todoSelected,
    ledgerSelected: state.myBuJo.ledgerSelected,
    noteSelected: state.myBuJo.noteSelected,
    items: state.recent.items
});

export default connect(mapStateToProps, {
    updateRecentItemsDates,
})(RecentItemList);
