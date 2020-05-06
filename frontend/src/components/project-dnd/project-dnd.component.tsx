import React from 'react';
import { History } from 'history';
import {Tree, Tooltip, Empty} from 'antd';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';
import { Project, ProjectsWithOwner } from '../../features/project/interface';
import { updateSharedProjectsOrder } from '../../features/project/actions';
import {
  CarryOutOutlined,
  AccountBookOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import {completedTasksReceived} from "../../features/tasks/actions";
import {Task} from "../../features/tasks/interface";

export const iconMapper = {
  TODO: <CarryOutOutlined />,
  LEDGER: <AccountBookOutlined />,
  NOTE: <FileTextOutlined />
};

const getTree = (
  data: Project[],
  owner: string,
  index: number,
  onClick: Function
): TreeNodeNormal[] => {
  let res = [] as TreeNodeNormal[];
  data.forEach((item: Project) => {
    const node = {} as TreeNodeNormal;
    if (item.subProjects && item.subProjects.length) {
      node.children = getTree(item.subProjects, owner, index, onClick);
    } else {
      node.children = [] as TreeNodeNormal[];
    }
    if (item.owner) {
      node.title = (
        <Tooltip placement="right" title={'Owner: ' + item.owner}>
          <span
            onClick={e => onClick(item.id)}>
            {iconMapper[item.projectType]}&nbsp;{item.name}
          </span>
        </Tooltip>
      );
    } else {
      node.title = (
        <Tooltip placement="right" title="Not Shared">
          <span
            style={{ color: '#e0e0eb', cursor: 'default' }}>
            {iconMapper[item.projectType]}&nbsp;{item.name}
          </span>
        </Tooltip>
      );
    }
    node.key = item.id.toString();
    res.push(node);
  });
  return res;
};

const reorder = (
  projects: ProjectsWithOwner[],
  startIndex: number,
  endIndex: number
) => {
  const result = projects.map(item => item.owner);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

type ProjectProps = {
  sharedProjects: ProjectsWithOwner[];
  updateSharedProjectsOrder: (projectOwners: string[]) => void;
  completedTasksReceived: (tasks: Task[]) => void;
};

class ProjectDnd extends React.Component<ProjectProps & RouteComponentProps> {
  onDragEnd = (result: any) => {
    const newOwners = reorder(
      this.props.sharedProjects,
      result.source.index,
      result.destination.index
    );
    this.props.updateSharedProjectsOrder(newOwners);
  };
  render() {
    if (this.props.sharedProjects.length === 0) {
      return <Empty />;
    }
    return (
      <div className="draggable-projects">
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="project-droppable">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {this.props.sharedProjects.map((item, index) => {
                  const treeNode = getTree(
                    item.projects,
                    item.owner,
                    index,
                    (itemId: number) => {
                      completedTasksReceived([]);
                      this.props.history.push(`/projects/${itemId}`);
                    }
                  );
                  return (
                    <Draggable
                      key={`${item.owner}+${item.owner}`}
                      draggableId={`${item.owner}+${item.owner}`}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Tree
                            defaultExpandAll
                            treeData={treeNode}
                            selectable={false}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}

export default connect(null, { updateSharedProjectsOrder, completedTasksReceived })(
  withRouter(ProjectDnd)
);
