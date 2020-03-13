import React from 'react';
import { History } from 'history';
import { Tree, Tooltip } from 'antd';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';
import { Project } from '../../features/project/interface';
import { updateSharedProjectsOrder } from '../../features/project/actions';
import {
  CarryOutOutlined,
  AccountBookOutlined,
  FileTextOutlined
} from '@ant-design/icons';
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
        <Tooltip placement="right" title={'Owner: ' + item.owner}>
          <span
            onClick={e => history.push(`/projects/${item.id}`)}>
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

type ProjectProps = {
    id: number,
    ownerName: string,
  ownProjects: Project[];
  updateSharedProjectsOrder: (projectOwners: string[]) => void;
};

const OwnProject: React.FC<RouteComponentProps & ProjectProps> = props => {
    const { ownProjects, history, ownerName, id } = props;
    const treeNode = getTree(ownProjects,ownerName,id,history);
    return (<div style={{marginLeft: '20%'}}><Tree
            className="ant-tree"
            multiple
            draggable
            blockNode
            // onDragEnter={onDragEnter}
            // switcherIcon={<FormOutlined/>}
            // onDrop={onDrop(notes, putNote, projectId)}
            treeData={treeNode}/></div>);
  }

export default connect(null, { updateSharedProjectsOrder })(
  withRouter(OwnProject)
);