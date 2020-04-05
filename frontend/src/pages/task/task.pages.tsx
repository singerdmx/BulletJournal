// page display contents of tasks
// react imports
import React, {useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {connect} from 'react-redux';
// features
//actions
import {deleteTask, getTask} from '../../features/tasks/actions';
import {getReminderSettingString, Task} from '../../features/tasks/interface';
import {Label, stringToRGB} from '../../features/label/interface';
import {addSelectedLabel} from '../../features/label/actions';
import {IState} from '../../store';
// antd imports
import {Avatar, Button, Card, Col, Divider, Popconfirm, Row, Statistic, Tag, Tooltip} from 'antd';
import {DeleteTwoTone, FileDoneOutlined, LoadingOutlined, PlusCircleTwoTone, TagOutlined, AlertOutlined, RollbackOutlined} from '@ant-design/icons';
// modals import
import EditTask from '../../components/modals/edit-task.component';
import MoveProjectItem from '../../components/modals/move-project-item.component';
import ShareProjectItem from '../../components/modals/share-project-item.component';

import {icons} from '../../assets/icons/index';
import './task-page.styles.less';
import 'braft-editor/dist/index.css';
import {ProjectType} from "../../features/project/constants";
import {convertToTextWithRRule} from "../../features/recurrence/actions";
import moment from "moment";
import {dateFormat} from "../../features/myBuJo/constants";
// components

type TaskProps = {
    task: Task;
    deleteTask: (taskId: number) => void;
};

interface TaskPageHandler {
    getTask: (taskId: number) => void;
    addSelectedLabel: (label: Label) => void;
}

// get icons by string name
const getIcon = (icon: string) => {
    let res = icons.filter(item => item.name === icon);
    return res.length > 0 ? res[0].icon : <TagOutlined/>;
};

const TaskPage: React.FC<TaskPageHandler & TaskProps> = props => {
    const {task, deleteTask} = props;
    // get id of task from oruter
    const {taskId} = useParams();
    // state control drawer displaying
    const [showEditor, setEditorShow] = useState(false);
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

    const getDueDateTime = (task: Task) => {
        if (task.recurrenceRule) {
            return <Col span={12}>
                <Card>
                    <Statistic
                        title="Recurring"
                        value={convertToTextWithRRule(task.recurrenceRule)}
                        prefix={<LoadingOutlined/>}
                    /></Card></Col>;
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
                </Card></Col>
        );
    };

    return (
        <div className="task-page">
            <Tooltip placement="top" title={`Assignee ${task.assignedTo}`} className="task-avatar">
        <span>
          <Avatar size="large" src={task.assignedToAvatar}/>
        </span>
            </Tooltip>
            <div className="task-title">
                <div className="label-and-name">
                    {task.name}
                    <div className="task-labels">
                        {task.labels &&
                        task.labels.map((label, index) => {
                            return (
                                <Tag
                                    key={index}
                                    className="labels"
                                    color={stringToRGB(label.value)}
                                    style={{cursor: 'pointer', display: 'inline-block'}}
                                >
                    <span onClick={() => toLabelSearching(label)}>
                      {getIcon(label.icon)} &nbsp;
                        {label.value}
                    </span>
                                </Tag>
                            );
                        })}
                    </div>
                </div>

                <div className="task-operation">
                    <Tooltip title={`Created by ${task.owner}`}>
                        <Avatar src={task.ownerAvatar}/>
                    </Tooltip>
                    <Tooltip title="Manage Labels">
                        <TagOutlined/>
                    </Tooltip>
                    <EditTask task={task} mode="icon"/>
                    <MoveProjectItem type={ProjectType.TODO} projectItemId={task.id} mode="icon"/>
                    <ShareProjectItem type={ProjectType.TODO} projectItemId={task.id} mode="icon"/>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Deleting Task also deletes its child tasks. Are you sure?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => {
                                deleteTask(task.id);
                                history.goBack();
                            }}
                            className="group-setting"
                            placement="bottom"
                        >
                            <DeleteTwoTone twoToneColor="#f5222d"/>
                        </Popconfirm>
                    </Tooltip>
                    <Tooltip title='Go Back'>
                        <RollbackOutlined onClick={e => history.goBack()}/>
                    </Tooltip>
                </div>
            </div>
            <Divider/>
            <div className="task-statistic-card">
                <Row gutter={10}>
                    {getDueDateTime(task)}
                    <Col span={12}>
                        <Card>
                            <Statistic
                                title="Reminder"
                                value={getReminderSettingString(task.reminderSetting)}
                                prefix={<AlertOutlined/>}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
            <Divider/>
            <div className="content">
                <div className="content-list">
                </div>
                <Button onClick={createHandler}>
                    <PlusCircleTwoTone/>
                    New
                </Button>
            </div>
            <div className="task-drawer">
            </div>
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    task: state.task.task
});

export default connect(mapStateToProps, {
    deleteTask,
    getTask,
    addSelectedLabel
})(TaskPage);
