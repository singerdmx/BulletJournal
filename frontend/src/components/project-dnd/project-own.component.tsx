import React, { useState } from 'react';
import { History } from 'history';
import { Tree, Tooltip } from 'antd';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';
import { Project } from '../../features/project/interface';
import { updateProjectRelations } from '../../features/project/actions';
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
    updateProjectRelations: (Projects: Project[]) => void;
};

const onDragEnter = (info: any) => {
  console.log(info.node)
  // expandedKeys 需要受控时设置
  // setState({
  //   expendKey: info.expandedKeys,
  // });
};

const findNoteById = (notes: Project[], noteId: number): Project => {
  let res = {} as Project;
  const searchNote = notes.find(item => item.id === noteId);
  if (searchNote) {
      res = searchNote;
  } else {
      for (let i = 0; i < notes.length; i++) {
          const searchSubNote = findNoteById(notes[i].subProjects, noteId);
          if (searchSubNote.id) {
              res = searchSubNote;
          }
      }
  }
  return res;
}

const dragNoteById = (projects: Project[], projectId: number): Project[] => {
  let res = [] as Project[];
  projects.forEach((item, index) => {
      let project = {} as Project;
      const subProjects = dragNoteById(item.subProjects, projectId);
      project = {...item, subProjects: subProjects};
      if (project.id !== projectId) res.push(project);

  })
  return res;
}

const DropNoteById = (projects: Project[], dropId: number, dropNote: Project): Project[] => {
  let res = [] as Project[];
  projects.forEach((item, index) => {
      let note = {} as Project;
      let subProjects = [] as Project[];
      if (item.id === dropId) {
          subProjects = item.subProjects;
          subProjects.push(dropNote);
      } else {
        subProjects = DropNoteById(item.subProjects, dropId, dropNote);
      }
      note = {...item, subProjects: subProjects}
      res.push(note);
  })
  return res;
}

const onDrop = (notes: Project[], updateProject: Function) => (info: any) => {
  const projectId = parseInt(info.dragNode.key)
  const targetNote = findNoteById(notes, projectId);
  const dropPos = info.node.props.pos.split('-');
  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
  const droppingIndex = info.dropPosition+1;
  const dragNotes = dragNoteById(notes, parseInt(info.dragNode.key));
  let resProjects = [] as Project[];
  if(dropPosition===-1){
    const dragIndex = notes.findIndex(note=>note.id===targetNote.id);
    if(dragIndex>=droppingIndex){
      dragNotes.splice(droppingIndex, 0, targetNote);
      resProjects = dragNotes;
    }else{
      dragNotes.splice(droppingIndex-1, 0, targetNote);
      resProjects = dragNotes;
    }
  }else{
    resProjects = DropNoteById(dragNotes, parseInt(info.node.key), targetNote);
  }
  updateProject(resProjects);
}

const OwnProject: React.FC<RouteComponentProps & ProjectProps> = props => {
    const { ownProjects, history, ownerName, id, updateProjectRelations } = props;
    const treeNode = getTree(ownProjects,ownerName,id,history);

    return (<div style={{marginLeft: '20%'}}><Tree
            className="ant-tree"
            draggable
            blockNode
            onDragEnter={onDragEnter}
            // switcherIcon={<FormOutlined/>}
            onDrop={onDrop(ownProjects, updateProjectRelations)}
            treeData={treeNode}/></div>);
  }

export default connect(null, { updateProjectRelations })(
  withRouter(OwnProject)
);