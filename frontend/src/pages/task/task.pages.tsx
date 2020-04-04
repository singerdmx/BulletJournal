// page display contents of tasks
// react imports
import React, {useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {connect} from 'react-redux';
// features
//actions
import {deleteTask, getTask} from '../../features/tasks/actions';
import {Task} from '../../features/tasks/interface';
import {Label, stringToRGB} from '../../features/label/interface';
import {addSelectedLabel} from '../../features/label/actions';
import {IState} from '../../store';
// antd imports
import {Avatar, Button, Divider, Popconfirm, Tag, Tooltip} from 'antd';
import {DeleteTwoTone, PlusCircleTwoTone, TagOutlined} from '@ant-design/icons';
// modals import
import EditTask from '../../components/modals/edit-task.component';
import MoveProjectItem from '../../components/modals/move-project-item.component';
import ShareProjectItem from '../../components/modals/share-project-item.component';

import {icons} from '../../assets/icons/index';
import './task-page.styles.less';
import 'braft-editor/dist/index.css';
import {ProjectType} from "../../features/project/constants";
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
  return res.length > 0 ? res[0].icon : <TagOutlined />;
};

const TaskPage: React.FC<TaskPageHandler & TaskProps> = props => {
  const { task, deleteTask } = props;
  // get id of task from oruter
  const { taskId } = useParams();
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

  return (
    <div className="task-page">
      <Tooltip placement="top" title={task.owner} className="task-avatar">
        <span>
          <Avatar size="large" src={task.ownerAvatar} />
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
                    style={{ cursor: 'pointer', display: 'inline-block' }}
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
          <Tooltip title="Add Label">
            <TagOutlined />
          </Tooltip>
          <Tooltip title="Edit Label">
            <EditTask task={task} mode="icon" />
          </Tooltip>
          <Tooltip title="Move Task">
            <MoveProjectItem type={ProjectType.TODO} projectItemId={task.id} mode="icon" />
          </Tooltip>
          <Tooltip title="Share Task">
            <ShareProjectItem type={ProjectType.TODO} projectItemId={task.id} mode="icon" />
          </Tooltip>
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
              <DeleteTwoTone twoToneColor="#f5222d" />
            </Popconfirm>
          </Tooltip>
        </div>
      </div>
      <Divider />
      <div className="content">
        <div className="content-list">
        </div>
        <Button onClick={createHandler}>
          <PlusCircleTwoTone />
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
