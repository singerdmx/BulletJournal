import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {withRouter, RouteComponentProps} from 'react-router';
import {TreeNodeNormal} from 'antd/lib/tree/Tree';
import {Tree} from 'antd';
import {
    deleteNote,
    updateNotes,
    putNote
} from '../../features/notes/actions';
import {Note} from '../../features/notes/interface';
import {IState} from '../../store';

type NotesProps = {
    notes: Note[];
    projectId: number,
    deleteNote: (NoteId: number) => void;
    updateNotes: (projectId: number) => void;
    putNote: (projectId: number, notes: Note[]) => void;
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
        node.title = <span>{item.name}</span>;
        node.key = item.id.toString();
        res.push(node);
    });
    return res;
};

const onDragEnter = (info: any) => {
    console.log(info.node)
    // expandedKeys 需要受控时设置
    // setState({
    //   expendKey: info.expandedKeys,
    // });
};

const findNoteById = (notes: Note[], noteId: number): Note => {
    let res = {} as Note;
    const searchNote = notes.find(item => item.id === noteId);
    if (searchNote) {
        res = searchNote;
    } else {
        for (let i = 0; i < notes.length; i++) {
            const searchSubNote = findNoteById(notes[i].subNotes, noteId);
            if (searchSubNote.id) {
                res = searchSubNote;
            }
        }
    }
    return res;
}

const dragNoteById = (notes: Note[], noteId: number): Note[] => {
    let res = [] as Note[];
    notes.forEach((item, index) => {
        let note = {} as Note;
        const subNotes = dragNoteById(item.subNotes, noteId);
        note = {...item, subNotes: subNotes};
        if (note.id !== noteId) res.push(note);

    })
    return res;
}

const DropNoteById = (notes: Note[], dropId: number, dropNote: Note): Note[] => {
    let res = [] as Note[];
    notes.forEach((item, index) => {
        let note = {} as Note;
        let subNotes = [] as Note[];
        if (item.id === dropId) {
            subNotes = item.subNotes;
            subNotes.push(dropNote);
        } else {
            subNotes = DropNoteById(item.subNotes, dropId, dropNote);
        }
        note = {...item, subNotes: subNotes}
        res.push(note);
    })
    return res;
}

const onDrop = (notes: Note[], putNote: Function, projectId: number) => (info: any) => {
    const targetNote = findNoteById(notes, parseInt(info.dragNode.key));
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const dragNotes = dragNoteById(notes, parseInt(info.dragNode.key));
    let resNotes = [] as Note[];
    if(dropPosition===-1){
        resNotes = [...dragNotes, targetNote];
    }else{
       resNotes = DropNoteById(dragNotes, parseInt(info.node.key), targetNote);
    }
    putNote(projectId, resNotes);
}

const NoteTree: React.FC<RouteComponentProps & NotesProps> = props => {
    const {projectId, notes, putNote, updateNotes} = props;
    useEffect(() => {
        if (projectId) {
            updateNotes(projectId);
        }
    }, [projectId])
    let treeNote = getTree(notes, `project${projectId}`, projectId);

    return (<Tree
        className="draggable-tree"
        draggable
        blockNode
        onDragEnter={onDragEnter}
        onDrop={onDrop(notes, putNote, projectId)}
        treeData={treeNote}/>);
}

const mapStateToProps = (state: IState) => ({
    projectId: state.project.project.id,
    notes: state.note.notes,
});

export default connect(mapStateToProps, {
    deleteNote,
    updateNotes,
    putNote
})(withRouter(NoteTree));