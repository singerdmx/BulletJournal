import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router';
import {TreeNodeNormal} from 'antd/lib/tree/Tree';
import {Empty, Result, Tree} from 'antd';
import TreeItem from '../project-item/note-item.component';
import {getNotesByOrder, putNote, updateNotes} from '../../features/notes/actions';
import {Note} from '../../features/notes/interface';
import {IState} from '../../store';
import './note-tree.component.styles.less';
import {Project} from '../../features/project/interface';
import {User} from '../../features/group/interface';
import {FieldTimeOutlined, FileAddOutlined} from '@ant-design/icons';
import AddNote from "../modals/add-note.component";
import {ProjectItemUIType} from "../../features/project/constants";
import {includeProjectItem} from "../../utils/Util";
import {Button as FloatButton, Container, darkColors, lightColors} from "react-floating-action-button";
import NotesByOrder from "../modals/notes-by-order.component";

type NotesProps = {
    timezone: string;
    notes: Note[];
    readOnly: boolean;
    project: Project | undefined;
    updateNotes: (projectId: number) => void;
    putNote: (projectId: number, notes: Note[]) => void;
    showModal?: (user: User) => void;
    showOrderModal?: () => void;
    labelsToKeep: number[];
    labelsToRemove: number[];
    getNotesByOrder: (
        projectId: number,
        timezone: string,
        startDate?: string,
        endDate?: string
    ) => void;
};

const getTree = (
    inProject: boolean,
    data: Note[],
    readOnly: boolean,
    labelsToKeep: number[],
    labelsToRemove: number[],
    showModal?: (user: User) => void,
    showOrderModal?: () => void
): TreeNodeNormal[] => {
    const res = [] as TreeNodeNormal[];
    data.forEach((item: Note) => {
        const node = {} as TreeNodeNormal;
        if (item.subNotes && item.subNotes.length > 0) {
            node.children = getTree(
                inProject,
                item.subNotes,
                readOnly,
                labelsToKeep,
                labelsToRemove,
                showModal,
                showOrderModal
            );
        } else {
            node.children = [] as TreeNodeNormal[];
        }
        node.title = (
            <TreeItem
                note={item}
                type={ProjectItemUIType.PROJECT}
                readOnly={readOnly}
                inProject={inProject}
                showModal={showModal}
                showOrderModal={showOrderModal}
            />
        );
        node.key = item.id.toString();
        if (includeProjectItem(labelsToKeep, labelsToRemove, item)) {
            res.push(node);
        }
    });
    return res;
};

const onDragEnter = (info: any) => {
    // expandedKeys 需要受控时设置
    // setState({
    //   expendKey: info.expandedKeys,
    // });
};

const findNoteById = (notes: Note[], noteId: number): Note => {
    let res = {} as Note;
    const searchNote = notes.find((item) => item.id === noteId);
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
};

const dragNoteById = (notes: Note[], noteId: number): Note[] => {
    const res = [] as Note[];
    notes.forEach((item, index) => {
        const subNotes = dragNoteById(item.subNotes, noteId);
        const note = {...item, subNotes: subNotes};
        if (note.id !== noteId) res.push(note);
    });
    return res;
};

const dropNoteById = (
    notes: Note[],
    dropId: number,
    dropNote: Note
): Note[] => {
    const res = [] as Note[];
    notes.forEach((item, index) => {
        let note = {} as Note;
        let subNotes = [] as Note[];
        if (item.id === dropId) {
            subNotes = item.subNotes;
            subNotes.push(dropNote);
        } else {
            subNotes = dropNoteById(item.subNotes, dropId, dropNote);
        }
        note = {...item, subNotes: subNotes};
        res.push(note);
    });
    return res;
};

const onDrop = (notes: Note[], putNote: Function, projectId: number) => (
    info: any
) => {
    const targetNote = findNoteById(notes, parseInt(info.dragNode.key));
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    const dragNotes = dragNoteById(notes, parseInt(info.dragNode.key));
    const droppingIndex = info.dropPosition + 1;
    let resNotes = [] as Note[];
    if (dropPosition === -1) {
        const dragIndex = notes.findIndex((note) => note.id === targetNote.id);
        if (dragIndex >= droppingIndex) {
            dragNotes.splice(droppingIndex, 0, targetNote);
            resNotes = dragNotes;
        } else {
            dragNotes.splice(droppingIndex - 1, 0, targetNote);
            resNotes = dragNotes;
        }
    } else {
        resNotes = dropNoteById(dragNotes, parseInt(info.node.key), targetNote);
    }
    putNote(projectId, resNotes);
};

const NoteTree: React.FC<RouteComponentProps & NotesProps> = (props) => {
    const {
        timezone,
        project,
        notes,
        putNote,
        updateNotes,
        readOnly,
        showModal,
        showOrderModal,
        getNotesByOrder,
        labelsToKeep,
        labelsToRemove
    } = props;
    useEffect(() => {
        if (project) {
            updateNotes(project.id);
        }
    }, [project]);
    const [notesByOrderShown, setNotesByOrderShown] = useState(false);

    if (!project) {
        return null;
    }

    if (notes.length === 0 && project.shared) {
        return <Empty/>
    }

    if (notes.length === 0) {
        return <div className='add-note-button'>
            <Result
                icon={<FileAddOutlined/>}
                extra={<AddNote mode='button'/>}
            />
        </div>
    }

    const treeNote = getTree(!project.shared, notes, readOnly, labelsToKeep, labelsToRemove, showModal, showOrderModal);

    const handleShowNotesOrdered = () => {
        getNotesByOrder(project.id, timezone);
        setNotesByOrderShown(true);
    };

    const createContent = () => {
        if (project.shared) {
            return null;
        }
        return <Container>
            {notes.length > 0 && <FloatButton
                tooltip="Note(s) Ordered by Update Time"
                onClick={handleShowNotesOrdered}
                styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
            >
                <FieldTimeOutlined/>
            </FloatButton>}
            <AddNote mode="icon"/>
        </Container>
    };

    return (
        <div>
            {createContent()}
            <div>
                <NotesByOrder
                    projectId={project.id}
                    visible={notesByOrderShown}
                    onCancel={() => {
                        setNotesByOrderShown(false);
                    }}
                />
            </div>
            <div>
                <Tree
                    className='ant-tree'
                    draggable
                    blockNode
                    onDragEnter={onDragEnter}
                    onDrop={onDrop(notes, putNote, project.id)}
                    treeData={treeNote}
                />
            </div>
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    project: state.project.project,
    notes: state.note.notes,
});

export default connect(mapStateToProps, {
    updateNotes,
    putNote,
    getNotesByOrder
})(withRouter(NoteTree));
