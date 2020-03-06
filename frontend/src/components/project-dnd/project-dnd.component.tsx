import React from 'react';
import { History } from 'history';
import { Tree } from 'antd';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';
import { Project, ProjectsWithOwner } from '../../features/project/interfaces';
import { updateSharedProjectsOrder } from '../../features/project/actions';
import {
  CarryOutOutlined,
  AccountBookOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';

export const iconMapper = {
  TODO: <CarryOutOutlined />,
  LEDGER: <AccountBookOutlined />,
  NOTE: <FileTextOutlined />
};

const getTree = (
  data: Project[],
  owner: string,
  index: number,
  history: History<History.PoorMansUnknown>
): TreeNodeNormal[] => {
  let res = [] as TreeNodeNormal[];
  data.forEach((item: Project) => {
    const node = {} as TreeNodeNormal;
    if (item.subProjects && item.subProjects.length) {
      node.children = getTree(item.subProjects, owner, index, history);
    } else {
      node.children = [] as TreeNodeNormal[];
    }
    if (item.owner) {
      node.title = (
        <span
          onClick={e => history.push(`/projects/${item.id}`)}
          title={'Owner: ' + item.owner}
        >
          {iconMapper[item.projectType]}&nbsp;{item.name}
        </span>
      );
    } else {
      node.title = (
        <span
          title="Not Shared"
          style={{ color: '#e0e0eb', cursor: 'default' }}
        >
          {iconMapper[item.projectType]}&nbsp;{item.name}
        </span>
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
};

class ProjectDnd extends React.Component<ProjectProps & RouteComponentProps> {
  onDragEnd = (result: any) => {
    console.log(result);
    const newOwners = reorder(
      this.props.sharedProjects,
      result.source.index,
      result.destination.index
    );
    this.props.updateSharedProjectsOrder(newOwners);
  };
  render() {
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
                    this.props.history
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

export default connect(null, { updateSharedProjectsOrder })(
  withRouter(ProjectDnd)
);
