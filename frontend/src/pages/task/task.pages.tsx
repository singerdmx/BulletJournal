// page display contents of tasks
// react imports
import React, {useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {connect} from 'react-redux';
// features
//actions
import {deleteTask, getTask} from '../../features/tasks/actions';
import {Task} from '../../features/tasks/interface';
import {Label} from '../../features/label/interface';
import {addSelectedLabel} from '../../features/label/actions';
import {IState} from '../../store';
// antd imports
import {Avatar, Card, Col, Popconfirm, Statistic, Tooltip,} from 'antd';
import {DeleteTwoTone, FileDoneOutlined, LoadingOutlined, TagOutlined, UpSquareOutlined,} from '@ant-design/icons';
// modals import
import EditTask from '../../components/modals/edit-task.component';
import MoveProjectItem from '../../components/modals/move-project-item.component';
import ShareProjectItem from '../../components/modals/share-project-item.component';

import './task-page.styles.less';
import 'braft-editor/dist/index.css';
import {ProjectType} from '../../features/project/constants';
import {convertToTextWithRRule} from '../../features/recurrence/actions';
import moment from 'moment';
import {dateFormat} from '../../features/myBuJo/constants';
// components
import TaskDetailPage from "./task-detail.pages";

export type TaskProps = {
    task: Task;
};

interface TaskPageHandler {
    getTask: (taskId: number) => void;
    addSelectedLabel: (label: Label) => void;
    deleteTask: (taskId: number) => void;
}

const TaskPage: React.FC<TaskPageHandler & TaskProps> = (props) => {
    const {task, deleteTask} = props;
    // get id of task from router
    const {taskId} = useParams();
    // state control drawer displaying
    const [showEditor, setEditorShow] = useState(false);
    const [labelEditable, setLabelEditable] = useState(false);
    // hook history in router
    const history = useHistory();
    // jump to label searching page by label click
    const toLabelSearching = (label: Label) => {
        console.log(label);
        props.addSelectedLabel(label);
        history.push('/labels/search');
    };
    // listening on the empty state working as componentDidmount
    React.useEffect(() => {
        taskId && props.getTask(parseInt(taskId));
    }, [taskId]);
    // show drawer
    const createHandler = () => {
        setEditorShow(true);
    };

    const labelEditableHandler = () => {
        setLabelEditable((labelEditable) => !labelEditable);
    };

    const getDueDateTime = (task: Task) => {
        if (task.recurrenceRule) {
            return (
                <Col span={12}>
                    <Card>
                        <Statistic
                            title='Recurring'
                            value={convertToTextWithRRule(task.recurrenceRule)}
                            prefix={<LoadingOutlined/>}
                        />
                    </Card>
                </Col>
            );
        }

        if (!task.dueDate) {
            return null;
        }

        let dueDateTitle = moment(task.dueDate, dateFormat).fromNow();
        if (task.duration) {
            dueDateTitle += `, duration ${task.duration} minutes`;
        }

        return (
            <Col span={12}>
                <Card>
                    <Statistic
                        title={`Due ${dueDateTitle}`}
                        value={`${task.dueDate} ${task.dueTime ? task.dueTime : ''}`}
                        prefix={<FileDoneOutlined/>}
                    />
                </Card>
            </Col>
        );
    };

    const taskOperation = () => {
        return <div className='task-operation'>
            <Tooltip title={`Created by ${task.owner}`}>
                <div className='task-owner'>
                    <Avatar src={task.ownerAvatar}/>
                </div>
            </Tooltip>

            <Tooltip title='Manage Labels'>
                <div>
                    <TagOutlined onClick={labelEditableHandler}/>
                </div>
            </Tooltip>
            <EditTask task={task} mode='icon'/>
            <MoveProjectItem
                type={ProjectType.TODO}
                projectItemId={task.id}
                mode='icon'
            />
            <ShareProjectItem
                type={ProjectType.TODO}
                projectItemId={task.id}
                mode='icon'
            />
            <Tooltip title='Delete'>
                <Popconfirm
                    title='Deleting Task also deletes its child tasks. Are you sure?'
                    okText='Yes'
                    cancelText='No'
                    onConfirm={() => {
                        deleteTask(task.id);
                        history.goBack();
                    }}
                    className='group-setting'
                    placement='bottom'
                >
                    <div>
                        <DeleteTwoTone twoToneColor='#f5222d'/>
                    </div>
                </Popconfirm>
            </Tooltip>
            <Tooltip title='Go to Parent BuJo'>
                <div>
                    <UpSquareOutlined
                        onClick={(e) => history.push(`/projects/${task.projectId}`)}
                    />
                </div>
            </Tooltip>
        </div>
    };

    return (
        <TaskDetailPage task={task} labelEditable={labelEditable} taskOperation={taskOperation}/>
    );
};

const mapStateToProps = (state: IState) => ({
    task: state.task.task,
});

export default connect(mapStateToProps, {
    deleteTask,
    getTask,
    addSelectedLabel,
})(TaskPage);
