// @ts-ignore
import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Divider, Drawer, Empty, Pagination, Tooltip} from 'antd';
import {HistoryOutlined, SyncOutlined} from "@ant-design/icons";
import moment from "moment";
import {dateFormat} from "../../features/myBuJo/constants";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getProjectItemHistory, historyReceived} from "../../features/notes/actions";
import ProjectItemHistory from "./project-item-history.component";
import {ProjectItemActivity} from "../../features/projectItem/interface";
import {ProjectItemType} from "../../features/project/constants";

const {RangePicker} = DatePicker;

type ProjectItemHistoryDrawerProps = {
    noteId: number;
    timezone: string;
    projectItemHistory: ProjectItemActivity[];
    historyReceived: (activities: ProjectItemActivity[]) => void;
    getProjectItemHistory: (
        noteId: number,
        pageInd: number,
        pageSize: number,
        startDate?: string,
        endDate?: string,
        timezone?: string
    ) => void;
};

interface ContentEditorDrawerHandler {
}

const ProjectItemHistoryDrawer: React.FC<ProjectItemHistoryDrawerProps & ContentEditorDrawerHandler> = (props) => {
    const {noteId, timezone, getProjectItemHistory, projectItemHistory} = props;
    const [visible, setVisible] = useState(false);
    const [dateArray, setDateArray] = useState(['', '']);
    const [historyIndex, setHistoryIndex] = useState(1);
    useEffect(() => {
        handleUpdate();
    }, []);

    const openModal = () => {
        historyReceived([]);
        setVisible(true);
    };

    const handleClose = (e: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        setVisible(false);
    };
    const handleRangeChange = (dates: any, dateStrings: string[]) => {
        setDateArray([dateStrings[0], dateStrings[1]]);
    };
    const handleUpdate = () => {
        getProjectItemHistory(noteId, 0, 50, dateArray[0], dateArray[1], timezone);
        setHistoryIndex(1);
    };

    // @ts-ignore
    const fullHeight = global.window.innerHeight;
    // @ts-ignore
    const fullWidth = global.window.innerWidth;
    const drawerWidth =
        fullWidth > fullHeight ? fullWidth * 0.75 : fullWidth;
    const handlePageChange = (page: number) => {
        setHistoryIndex(page);
    };
    const getModal = () => {
        return (
            <Drawer
                placement={'left'}
                onClose={(e) => handleClose(e)}
                visible={visible}
                width={drawerWidth}
                destroyOnClose
                footer={
                    <Pagination
                        style={{textAlign: 'center'}}
                        pageSize={1}
                        current={historyIndex}
                        onChange={handlePageChange}
                        total={projectItemHistory.length}
                    />
                }
            >
                <div>
                    <div className="range-picker" style={{paddingBottom: '20px'}}>
                        <RangePicker
                            ranges={{
                                Today: [moment(), moment()],
                                'This Week': [moment().startOf('week'), moment().endOf('week')],
                                'This Month': [
                                    moment().startOf('month'),
                                    moment().endOf('month'),
                                ],
                            }}
                            value={
                                dateArray[0] ? [moment(dateArray[0]), moment(dateArray[1])] : null
                            }
                            size="small"
                            allowClear={true}
                            format={dateFormat}
                            placeholder={['Start Date', 'End Date']}
                            onChange={handleRangeChange}
                            style={{marginLeft: '20px'}}
                        />
                        <span className='history-refresh-button'>
                            <Button
                                type="primary"
                                icon={<SyncOutlined/>}
                                onClick={handleUpdate}
                            >
                              Refresh
                            </Button>
                        </span>
                    </div>
                    <Divider/>
                    {projectItemHistory.length > 0 ? (
                        <ProjectItemHistory
                            activities={projectItemHistory}
                            historyIndex={historyIndex - 1}
                            projectItemType={ProjectItemType.NOTE}
                        />
                    ) : (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description='No Data. '
                        />
                    )}
                </div>
            </Drawer>
        );
    };
    return (
        <Tooltip title='View History'>
            <div>
            <span onClick={openModal}>
              <HistoryOutlined/>
                {getModal()}
            </span>
            </div>
        </Tooltip>

    );
};

const mapStateToProps = (state: IState) => ({
    timezone: state.settings.timezone,
    projectItemHistory: state.note.projectItemHistory
});

export default connect(mapStateToProps, {
    historyReceived,
    getProjectItemHistory,
})(ProjectItemHistoryDrawer);
