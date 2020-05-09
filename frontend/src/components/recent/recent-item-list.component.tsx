import React from 'react';
import moment from "moment";
import {dateFormat} from "../../features/myBuJo/constants";
import {DatePicker, Divider, Tooltip} from "antd";
import {Link} from "react-router-dom";
import {IState} from "../../store";
import {connect} from "react-redux";
import {updateExpandedMyself} from "../../features/myself/actions";

const {RangePicker} = DatePicker;

type RecentItemProps = {
    todoSelected: boolean;
    ledgerSelected: boolean;
    noteSelected: boolean;
    timezone: string;
    startDate: string;
    endDate: string;
    updateExpandedMyself: (updateSettings: boolean) => void;
};

const RecentItemList: React.FC<RecentItemProps> = ({
                                                       todoSelected,
                                                       ledgerSelected,
                                                       noteSelected,
                                                       timezone,
                                                       startDate,
                                                       endDate,
                                                       updateExpandedMyself
                                                   }) => {
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
                    moment(
                        startDate
                            ? startDate
                            : new Date().toLocaleString('fr-CA'),
                        dateFormat
                    ),
                    moment(
                        endDate
                            ? endDate
                            : new Date().toLocaleString('fr-CA'),
                        dateFormat
                    ),
                ]}
                format={dateFormat}
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
    noteSelected: state.myBuJo.noteSelected
});

export default connect(mapStateToProps, {
    updateExpandedMyself,
})(RecentItemList);
