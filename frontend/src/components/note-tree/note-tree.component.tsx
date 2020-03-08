import React, { useEffect } from 'react';
// import { CloseOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
// import { Button, List, Badge, Avatar, Typography, Popconfirm, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';
import { History } from 'history';
import { Tree } from 'antd';
import {
  deleteNote,
  updateNotes
} from '../../features/notes/actions';
import { Note } from '../../features/notes/interface';
import { IState } from '../../store';

type NotesProps = {
  notes: Note[];
  projectId: number,
  deleteNote: (NoteId: number) => void;
  updateNotes: (projectId: number) => void;
};

const getTree = (
    data: Note[],
    name: string,
    index: number
  ): TreeNodeNormal[] => {
    let res = [] as TreeNodeNormal[];
    data.forEach((item: Note) => {
      const node = {} as TreeNodeNormal;
      if (item.subNotes && item.subNotes.length) {
        node.children = getTree(item.subNotes, item.name, index);
      } else {
        node.children = [] as TreeNodeNormal[];
      }
      node.title = item.name;
      node.key = item.id.toString();
      res.push(node);
    });
    return res;
  };


const NoteTree: React.FC<RouteComponentProps & NotesProps> = props => {
    const { projectId, notes } = props;
    useEffect(()=>{
        props.updateNotes(projectId);
    }, [projectId])
    let treeNote = getTree(notes, `project${projectId}`, projectId);
    return (<Tree treeData={treeNote}/>);
}



const mapStateToProps = (state: IState) => ({
    projectId: state.project.project.id,
    notes: state.note.notes,
});

export default connect(mapStateToProps, {
  deleteNote,
  updateNotes
})(withRouter(NoteTree));