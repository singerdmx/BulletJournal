import React, {useEffect} from 'react';

import './task-status.styles.less';
import {useHistory, useParams} from "react-router-dom";
import {Tooltip} from "antd";
import {UpSquareOutlined} from '@ant-design/icons';
import {IState} from "../../store";
import {getTasksByOrder} from "../../features/tasks/actions";
import {connect} from "react-redux";
import {Task} from "../../features/tasks/interface";
import TaskItem from "../../components/project-item/task-item.component";
import {ProjectItemUIType} from "../../features/project/constants";

type TaskStatusProps = {
    timezone: string;
    tasksByOrder: Task[];
    getTasksByOrder: (
        projectId: number,
        timezone: string,
        startDate?: string,
        endDate?: string
    ) => void;
};

const TaskStatusPage: React.FC<TaskStatusProps> = (
    {
        getTasksByOrder,
        timezone,
        tasksByOrder
    }) => {
    const {projectId} = useParams();
    const history = useHistory();
    useEffect(() => {
        if (!projectId) {
            return;
        }
        getTasksByOrder(parseInt(projectId), timezone, undefined, undefined);
    }, [projectId]);
    return (
        <div className='task-status-page'>
            <div className='task-operation'>
                <Tooltip title='Go to BuJo'>
                    <div>
                        <UpSquareOutlined
                            onClick={(e) => history.push(`/projects/${projectId}`)}
                        />
                    </div>
                </Tooltip>
            </div>
            <div>
                {
                    tasksByOrder.map((task, index) => {
                        return (
                            <div key={index} style={{display: 'flex', alignItems: 'center'}}>
                                <TaskItem
                                    task={task}
                                    type={ProjectItemUIType.ORDER}
                                    readOnly={false}
                                    inProject={false}
                                    inModal={false}
                                    isComplete={false}
                                    completeOnlyOccurrence={false}
                                />
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    timezone: state.settings.timezone,
    tasksByOrder: state.task.tasksByOrder,
});

export default connect(mapStateToProps, {
    getTasksByOrder,
})(TaskStatusPage);
