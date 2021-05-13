// @ts-ignore
import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Divider, Drawer, Empty, Pagination, Popover, Tooltip} from 'antd';
import {HighlightOutlined, HistoryOutlined, SyncOutlined} from "@ant-design/icons";
import moment from "moment";
import {dateFormat} from "../../features/myBuJo/constants";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getProjectItemHistory} from "../../features/notes/actions";
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
    projectItemHistory: ProjectItemActivity[];
    getProjectItemHistory: (
        noteId: number,
        pageInd: number,
        pageSize: number,
        startDate?: string,
        endDate?: string,
        timezone?: string
    ) => void;
    content: Content | undefined;
    projectType: ProjectType;
    setDisplayRevision: (displayRevision: boolean) => void;
    editable: boolean;
};

const ProjectItemHistoryDrawer: React.FC<ProjectItemHistoryDrawerProps> = (props) => {
    const {
        projectItemId,
        timezone,
        getProjectItemHistory,
        projectItemHistory,
        content,
        setDisplayRevision,
        projectType,
        editable
    } = props;
    const [projectItemDrawerVisible, setProjectItemDrawerVisible] = useState(false);
    const [dateArray, setDateArray] = useState(['', '']);
    const [historyIndex, setHistoryIndex] = useState(1);

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
        getProjectItemHistory(projectItemId, 0, 50, dateArray[0], dateArray[1], timezone);
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
            <Button className="view-history-choice" onClick={showProjectItemRevisionHistory} style={{textAlign: "left"}}>{
                iconMapper[projectType]}{projectTypeMapper[projectType]} Revision History
            </Button>
            <br/>
            <Button  className="view-history-choice" onClick={showContentRevisionHistory} style={{textAlign: "left"}}>
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
    projectItemHistory: state.note.projectItemHistory,
    content: state.content.content,
});

export default connect(mapStateToProps, {
    getProjectItemHistory,
    setDisplayRevision,
})(ProjectItemHistoryDrawer);
