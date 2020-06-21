import React from 'react';

import './task-status.styles.less';
import {useHistory, useParams} from "react-router-dom";
import {Tooltip} from "antd";
import {UpSquareOutlined} from '@ant-design/icons';

type TaskStatusProps = {};

const TaskStatusPage: React.FC<TaskStatusProps> = (props) => {
    const {projectId} = useParams();
    const history = useHistory();
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
            </div>
        </div>
    );
};


export default TaskStatusPage;
