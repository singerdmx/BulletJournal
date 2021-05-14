// @ts-ignore
import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Divider, Drawer, Empty, Pagination, Popover, Tooltip} from 'antd';
import {HighlightOutlined, HistoryOutlined, SyncOutlined} from "@ant-design/icons";
import moment from "moment";
import {dateFormat} from "../../features/myBuJo/constants";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getProjectItemHistory as getNoteHistory} from "../../features/notes/actions";
import {getProjectItemHistory as getTaskHistory} from "../../features/tasks/actions";
import {getProjectItemHistory as getTransactionHistory} from "../../features/transactions/actions";
import ProjectItemHistory from "./project-item-history.component";
import {ProjectItemActivity} from "../../features/projectItem/interface";
import {ProjectType} from '../../features/project/constants';
import {Content} from "../../features/myBuJo/interface";
import {setDisplayRevision} from "../../features/content/actions";
import {iconMapper} from "../project-dnd/project-dnd.component";

const {RangePicker} = DatePicker;

export const projectTypeMapper = {
    TODO: "Task",
    LEDGER: "Transaction",
    NOTE: "Note"
};

type ProjectItemHistoryDrawerProps = {
    projectItemId: number;
    timezone: string;
    noteHistory: ProjectItemActivity[];
    taskHistory: ProjectItemActivity[];
    transactionHistory: ProjectItemActivity[];
    getNoteHistory: (
        noteId: number,
        pageInd: number,
        pageSize: number,
        startDate?: string,
        endDate?: string,
        timezone?: string
    ) => void;
    getTaskHistory: (
        taskId: number,
        pageInd: number,
        pageSize: number,
        startDate?: string,
        endDate?: string,
        timezone?: string
    ) => void;
    getTransactionHistory: (
        transactionId: number,
        pageInd: number,
        pageSize: number,
        startDate?: string,
        endDate?: string,
        timezone?: string
    ) => void;
    content: Content | undefined;
    projectType: ProjectType;
    setDisplayRevision: (displayRevision: boolean) => void;
    editable?: boolean;
};

const ProjectItemHistoryDrawer: React.FC<ProjectItemHistoryDrawerProps> = (props) => {
    const {
        projectItemId,
        timezone,
        getNoteHistory,
        getTaskHistory,
        getTransactionHistory,
        noteHistory,
        taskHistory,
        transactionHistory,
        content,
        setDisplayRevision,
        projectType,
        editable
    } = props;
    const [projectItemDrawerVisible, setProjectItemDrawerVisible] = useState(false);
    const [dateArray, setDateArray] = useState(['', '']);
    const [historyIndex, setHistoryIndex] = useState(1);
    const [currentHistories, setCurrentHistories] = useState();

    useEffect(() => {
        if (projectType === ProjectType.NOTE) {
            setCurrentHistories(noteHistory);
        } else if(projectType === ProjectType.TODO) {
            setCurrentHistories(taskHistory);
        } else if (projectType === ProjectType.LEDGER) {
            setCurrentHistories(transactionHistory);
        }
    },[noteHistory, taskHistory, transactionHistory, projectItemId])

    useEffect(() => {
        handleUpdate();
        setDateArray(['', '']);
    }, [projectItemDrawerVisible]);

    const handleClose = (e: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        setProjectItemDrawerVisible(false);
    };
    const handleRangeChange = (dates: any, dateStrings: string[]) => {
        setDateArray([dateStrings[0], dateStrings[1]]);
    };

    const handleUpdate = () => {
        if (projectType === ProjectType.NOTE) {
            getNoteHistory(projectItemId, 0, 50, dateArray[0], dateArray[1], timezone);
        } else if (projectType === ProjectType.TODO) {
            getTaskHistory(projectItemId, 0, 50, dateArray[0], dateArray[1], timezone);
        } else if (projectType === ProjectType.LEDGER) {
            getTransactionHistory(projectItemId, 0, 50, dateArray[0], dateArray[1], timezone);
        }
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

    const showProjectItemRevisionHistory = () => {
        setProjectItemDrawerVisible(true);
    }

    const showContentRevisionHistory = () => {
        setDisplayRevision(true);
    }

    const projectItemRevisionHistoryDrawer = <Drawer
        placement={'left'}
        onClose={(e) => handleClose(e)}
        visible={projectItemDrawerVisible}
        width={drawerWidth}
        destroyOnClose
        footer={
            <Pagination
                style={{textAlign: 'center'}}
                pageSize={1}
                current={historyIndex}
                onChange={handlePageChange}
                total={currentHistories ? currentHistories.length : 0}
            />
        }
    >
        <div>
            <div className="time-range-picker" >
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
                />
                <span className='project-item-history-refresh-button'>
                            <Button
                                type="primary"
                                icon={<SyncOutlined/>}
                                onClick={handleUpdate}
                                style={{marginLeft:"60px"}}
                            >
                              Refresh
                            </Button>
                        </span>
            </div>
            <Divider/>
            {currentHistories && currentHistories.length > 0 ? (
                <ProjectItemHistory
                    activities={currentHistories}
                    historyIndex={historyIndex - 1}
                    projectType={projectType}
                />
            ) : (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description='No Data. '
                />
            )}
        </div>
    </Drawer>

    const chooseDrawer = () => {
        return content && <div className="view-history">
            <Button className="view-history-choice" onClick={showProjectItemRevisionHistory}
                    style={{textAlign: "left"}}>{
                iconMapper[projectType]}{projectTypeMapper[projectType]} Revision History
            </Button>
            <br/>
            <Button className="view-history-choice" onClick={showContentRevisionHistory} style={{textAlign: "left"}}>
                <HighlightOutlined/>Current Content Revision History ({content.revisions.length - 1})
            </Button>
        </div>
    };

    // choose one of the drawers
    if (content && content.revisions.length > 1 && editable) {
        return (
            <div>
                <Popover placement="left" title='View History' content={chooseDrawer()}
                         trigger="click">
                    <HistoryOutlined/>
                </Popover>
                {projectItemRevisionHistoryDrawer}
            </div>
        )
    }

    // no need to choose
    return (
        <Tooltip title='View History'>
            <span onClick={showProjectItemRevisionHistory}>
              <HistoryOutlined/>
                {projectItemRevisionHistoryDrawer}
            </span>
        </Tooltip>
    );
};

const mapStateToProps = (state: IState) => ({
    timezone: state.settings.timezone,
    noteHistory: state.note.projectItemHistory,
    taskHistory: state.task.projectItemHistory,
    transactionHistory: state.transaction.projectItemHistory,
    content: state.content.content,
});

export default connect(mapStateToProps, {
    getNoteHistory,
    getTaskHistory,
    getTransactionHistory,
    setDisplayRevision,
})(ProjectItemHistoryDrawer);
