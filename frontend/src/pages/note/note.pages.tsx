// page display contents of notes
// react imports
import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {connect} from 'react-redux';
// features
//actions
import {deleteNote, getNote, updateNoteContents, deleteContent} from '../../features/notes/actions';

import {IState} from '../../store';
// components
import ContentEditorDrawer from '../../components/content-editor/content-editor-drawer.component';
// antd imports
import {Popconfirm, Tooltip} from 'antd';
import {DeleteTwoTone, PlusOutlined, SyncOutlined, UpSquareOutlined,} from '@ant-design/icons';
// modals import
import EditNote from '../../components/modals/edit-note.component';
import MoveProjectItem from '../../components/modals/move-project-item.component';
import ShareProjectItem from '../../components/modals/share-project-item.component';

import './note-page.styles.less';
import 'braft-editor/dist/index.css';
import {ProjectItemUIType, ProjectType,} from '../../features/project/constants';
import NoteDetailPage, {NoteProps} from './note-detail.pages';
import LabelManagement from '../project/label-management.compoent';
import {Button as FloatButton, Container, darkColors, lightColors,} from 'react-floating-action-button';
import {DeleteOutlined, EditOutlined, HighlightOutlined, MenuOutlined} from "@ant-design/icons/lib";
import {setDisplayMore, setDisplayRevision} from "../../features/content/actions";
import {Content} from "../../features/myBuJo/interface";

interface NotePageHandler {
    contents: Content[];
    content: Content | undefined;
    getNote: (noteId: number) => void;
    deleteNote: (noteId: number, type: ProjectItemUIType) => void;
    updateNoteContents: (noteId: number) => void;
    setDisplayMore: (displayMore: boolean) => void;
    setDisplayRevision: (displayRevision: boolean) => void;
    deleteContent: (noteId: number, contentId: number) => void;
}

// get icons by string name

const NotePage: React.FC<NotePageHandler & NoteProps> = (props) => {
    // hook history in router
    const history = useHistory();
    const {note, deleteNote, contents, content, getNote, updateNoteContents, setDisplayMore, setDisplayRevision, deleteContent} = props;
    // get id of note from router
    const {noteId} = useParams();
    // state control drawer displaying
    const [showEditor, setEditorShow] = useState(false);
    const [labelEditable, setLabelEditable] = useState(false);

    // listening on the empty state working as componentDidmount
    useEffect(() => {
        noteId && getNote(parseInt(noteId));
    }, [noteId]);

    useEffect(() => {
        if (!note) {
            return;
        }
        updateNoteContents(note.id);
        setDisplayMore(false);
        setDisplayRevision(false);
    }, [note]);

    // show drawer
    const createHandler = () => {
        setEditorShow(true);
    };

    const handleClose = () => {
        setEditorShow(false);
    };

    const handleRefresh = () => {
        note && note.id && updateNoteContents(note.id);
    };

    const labelEditableHandler = () => {
        setLabelEditable((labelEditable) => !labelEditable);
    };
    if (!note) return null;

    const handleEdit = () => {
        setDisplayMore(true);
    };

    const handleOpenRevisions = () => {
        setDisplayRevision(true);
    };

    const handleDelete = () => {
        if (!content) {
            return;
        }
        console.log('delete')
        deleteContent(note.id, content.id);
    };


    const createContentElem = (
        <Container>
            {content && <FloatButton
                tooltip="Delete Content"
                onClick={handleDelete}
                styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
            >
                <DeleteOutlined/>
            </FloatButton>}
            {content && content.revisions.length > 1 && <FloatButton
                tooltip={`View Revision History (${content.revisions.length - 1})`}
                onClick={handleOpenRevisions}
                styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
            >
                <HighlightOutlined/>
            </FloatButton>}
            {content && <FloatButton
                tooltip="Edit Content"
                onClick={handleEdit}
                styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
            >
                <EditOutlined/>
            </FloatButton>}
            <FloatButton
                tooltip="Add Content"
                onClick={createHandler}
                styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
            >
                <PlusOutlined/>
            </FloatButton>
            <FloatButton
                tooltip="Actions"
                styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
            >
                <MenuOutlined/>
            </FloatButton>
        </Container>
    );

    const noteEditorElem = (
        <div className="note-drawer">
            <ContentEditorDrawer
                projectItem={note}
                visible={showEditor}
                onClose={handleClose}
            />
        </div>
    );

    const noteOperation = () => {
        return (
            <div className="note-operation">
                <LabelManagement
                    labelEditableHandler={labelEditableHandler}
                    labelEditable={labelEditable}
                />
                <EditNote note={note} mode="icon"/>
                <MoveProjectItem
                    type={ProjectType.NOTE}
                    projectItemId={note.id}
                    mode="icon"
                />
                <ShareProjectItem
                    type={ProjectType.NOTE}
                    projectItemId={note.id}
                    mode="icon"
                />
                <Tooltip title="Delete">
                    <Popconfirm
                        title="Deleting Note also deletes its child notes. Are you sure?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => {
                            deleteNote(note.id, ProjectItemUIType.PAGE);
                            history.goBack();
                        }}
                        className="group-setting"
                        placement="bottom"
                    >
                        <div>
                            <DeleteTwoTone twoToneColor="#f5222d"/>
                        </div>
                    </Popconfirm>
                </Tooltip>
                <Tooltip title="Refresh Contents">
                    <div>
                        <SyncOutlined onClick={handleRefresh}/>
                    </div>
                </Tooltip>
                <Tooltip title="Go to Parent BuJo">
                    <div>
                        <UpSquareOutlined
                            onClick={(e) => history.push(`/projects/${note.projectId}`)}
                        />
                    </div>
                </Tooltip>
            </div>
        );
    };

    return (
        <NoteDetailPage
            note={note}
            labelEditable={labelEditable}
            noteOperation={noteOperation}
            createContentElem={createContentElem}
            noteEditorElem={noteEditorElem}
            contents={contents}
        />
    );
};

const mapStateToProps = (state: IState) => ({
    note: state.note.note,
    contents: state.note.contents,
    content: state.content.content
});

export default connect(mapStateToProps, {
    deleteNote,
    getNote,
    updateNoteContents,
    deleteContent,
    setDisplayMore,
    setDisplayRevision
})(NotePage);
