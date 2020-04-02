import React from 'react';
import {Avatar, Popconfirm, Popover, Tag, Tooltip} from 'antd';
import {
    CheckCircleTwoTone,
    CloseCircleOutlined,
    DeleteTwoTone,
    FileDoneOutlined,
    MoreOutlined,
    TagOutlined
} from '@ant-design/icons';
import {Task} from '../../features/tasks/interface';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {completeTask, deleteCompletedTask, deleteTask, uncompleteTask} from '../../features/tasks/actions';
import EditTask from '../modals/edit-task.component';
import './task-item.styles.less';
import {icons} from "../../assets/icons";
import {stringToRGB} from "../../features/label/interface";
import moment from "moment";
import {dateFormat} from "../../features/myBuJo/constants";

type TaskProps = {
    task: Task;
    isComplete: boolean;
    completeTask: (taskId: number) => void;
    uncompleteTask: (taskId: number) => void;
    deleteTask: (taskId: number) => void;
    deleteCompletedTask: (taskId: number) => void;
};

const ManageTask: React.FC<TaskProps> = props => {

    const {
        task,
        isComplete,
        completeTask,
        uncompleteTask,
        deleteTask,
        deleteCompletedTask
    } = props;
    if (isComplete) {
        return (
            <div style={{display: 'flex', flexDirection: 'column'}}>
                <EditTask/>
                <Popconfirm
                    title='Deleting Task also deletes its child tasks. Are you sure?'
                    okText='Yes'
                    cancelText='No'
                    onConfirm={() => deleteCompletedTask(task.id)}
                    className='group-setting'
                    placement='bottom'
                >
                    <div className='popover-control-item'>
                        <span>Delete</span>
                        <DeleteTwoTone twoToneColor='#f5222d'/>
                    </div>
                </Popconfirm>
                <div
                    onClick={() => uncompleteTask(task.id)}
                    className='popover-control-item'
                >
                    <span>Uncomplete</span>
                    <CloseCircleOutlined twoToneColor='#52c41a'/>
                </div>
            </div>
        );
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <EditTask/>
            <Popconfirm
                title='Deleting Task also deletes its child tasks. Are you sure?'
                okText='Yes'
                cancelText='No'
                onConfirm={() => deleteTask(task.id)}
                className='group-setting'
                placement='bottom'
            >
                <div className='popover-control-item'>
                    <span>Delete</span>
                    <DeleteTwoTone twoToneColor='#f5222d'/>
                </div>
            </Popconfirm>
            <div
                onClick={() => completeTask(task.id)}
                className='popover-control-item'
            >
                <span>Complete</span>
                <CheckCircleTwoTone twoToneColor='#52c41a'/>
            </div>
        </div>
    );
};

const TaskItem: React.FC<TaskProps> = props => {
    const getIcon = (icon: string) => {
        let res = icons.filter(item => item.name === icon);
        return res.length > 0 ? res[0].icon : <TagOutlined/>;
    };

    const {
        task,
        isComplete,
        completeTask,
        uncompleteTask,
        deleteTask,
        deleteCompletedTask
    } = props;
    return (
        <div className='task-item'>
            <div className='task-item-content'>
                <Link to={`/task/${task.id}`}>
                    <h3 className='task-item-name'>
                        {task.labels && task.labels[0] ? (
                            getIcon(task.labels[0].icon)
                        ) : (
                            <FileDoneOutlined/>
                        )}{' '}
                        {task.name}
                    </h3>
                </Link>
                <div className='task-item-subs'>
                    <div className='task-item-labels'>
                        {task.labels &&
                        task.labels.map(label => {
                            return (
                                <Tag
                                    key={`label${label.id}`}
                                    className='labels'
                                    color={stringToRGB(label.value)}
                                >
                    <span>
                      {getIcon(label.icon)} &nbsp;
                        {label.value}
                    </span>
                                </Tag>
                            );
                        })}
                    </div>
                    <div className='task-item-time'>
                        {task.dueDate && moment(task.dueDate, dateFormat).fromNow()}
                    </div>
                </div>
            </div>

            <div className='task-control'>
                <div className='task-item-owner'>
                    <Tooltip title={`Owner ${task.owner}`}>
                        <Avatar src={task.ownerAvatar} size='small'/>
                    </Tooltip>
                </div>
                <div className='task-item-assignee'>
                    <Tooltip title={`Assignee ${task.assignedTo}`}>
                        <Avatar src={task.assignedToAvatar} size='small'/>
                    </Tooltip>
                </div>
                <Popover
                    arrowPointAtCenter
                    placement='rightTop'
                    overlayStyle={{width: '150px'}}
                    content={<ManageTask
                        task={task}
                        isComplete={isComplete}
                        completeTask={completeTask}
                        uncompleteTask={uncompleteTask}
                        deleteTask={deleteTask}
                        deleteCompletedTask={deleteCompletedTask}
                    />}
                    trigger='click'
                >
                  <span className='task-control-more'>
                    <MoreOutlined/>
                  </span>
                </Popover>
            </div>
        </div>
    );
};

export default connect(null, {
    completeTask,
    uncompleteTask,
    deleteTask,
    deleteCompletedTask
})(TaskItem);
