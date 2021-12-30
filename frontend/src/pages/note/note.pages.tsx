// page display contents of notes
// react imports
import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {connect} from 'react-redux';
// features
//actions
import {deleteContent, deleteNote, exportNote, getNote, updateNoteContents} from '../../features/notes/actions';

import {IState} from '../../store';
// components
import ContentEditorDrawer from '../../components/content-editor/content-editor-drawer.component';
// antd imports
import {Button, Popconfirm, Popover, Tooltip} from 'antd';
import {
    DeleteTwoTone,
    ExportOutlined,
    FileImageOutlined,
    FilePdfOutlined,
    PlusOutlined,
    SyncOutlined,
    UpSquareOutlined
} from '@ant-design/icons';
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
import {DeleteOutlined, EditOutlined} from "@ant-design/icons/lib";
import {setDisplayMore, setDisplayRevision} from "../../features/content/actions";
import {Content, ProjectItem} from "../../features/myBuJo/interface";
import {getProject} from "../../features/project/actions";
import {Project} from "../../features/project/interface";
import NoteColorSettingDialog from '../../components/modals/note-color.component';
import {resizeFloatButton} from "../../utils/Util";
import ProjectItemHistoryDrawer from "../../components/project-item/project-item-history-drawer";

interface NotePageHandler {
    myself: string;
    project: Project | undefined;
    contents: Content[];
    content: Content | undefined;
    getNote: (noteId: number) => void;
    deleteNote: (noteId: number, type: ProjectItemUIType) => void;
    updateNoteContents: (noteId: number, updateDisplayMore?: boolean) => void;
    setDisplayMore: (displayMore: boolean) => void;
    setDisplayRevision: (displayRevision: boolean) => void;
    deleteContent: (noteId: number, contentId: number) => void;
    getProject: (projectId: number) => void;
    exportNote: (
        noteId: number,
        contents: Content[],
        exportType: string,
        fileName: string
    ) => void;

}

const NotePage: React.FC<NotePageHandler & NoteProps> = (props) => {
    // hook history in router
    const history = useHistory();
    const {myself, note, project, deleteNote, contents, content, getNote, updateNoteContents,
        setDisplayMore, setDisplayRevision, deleteContent, getProject} = props;
    // get id of note from router
    const {noteId} = useParams();
    // state control drawer displaying
    const [showEditor, setEditorShow] = useState(true);
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
        getProject(note.projectId);
        resizeFloatButton(4);
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
        note && note.id && getNote(note.id);
    };

    const labelEditableHandler = () => {
        setLabelEditable((labelEditable) => !labelEditable);
    };
    if (!note) return null;

    const handleEdit = () => {
        note && note.id && updateNoteContents(note.id, true);
    };

    const handleDelete = () => {
        if (!content) {
            return;
        }
        deleteContent(note.id, content.id);
    };

    const exportAsImageOrPdf = () => {
        return <div className="export">
            <Button onClick={() => props.exportNote(note.id, contents, "Pdf", note!.name + ".pdf")}><FilePdfOutlined/>PDF</Button>
            <Button onClick={() => props.exportNote(note.id, contents, "Image", note!.name + ".png")}><FileImageOutlined/>Image</Button>
        </div>
    }

    const createContentElem = (
        <Container>
            <FloatButton
                tooltip="Go to Parent BuJo"
                onClick={() => history.push(`/projects/${note.projectId}`)}
                styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
            >
                <UpSquareOutlined/>
            </FloatButton>
            {note.editable && <NoteColorSettingDialog />}
            <FloatButton
                tooltip="Refresh Contents"
                onClick={handleRefresh}
                styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
            >
                <SyncOutlined/>
            </FloatButton>
            {content && content.deletable && <FloatButton
                tooltip="Delete Content"
                onClick={handleDelete}
                styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
            >
                <DeleteOutlined/>
            </FloatButton>}
            {content && content.editable && <FloatButton
                tooltip="Edit Content"
                onClick={handleEdit}
                styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
            >
                <EditOutlined/>
            </FloatButton>}
            <Popover placement="left" title='Export Note' content={exportAsImageOrPdf()}
                     trigger="click">
                <FloatButton
                    tooltip="Export"
                    styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
                >
                    <ExportOutlined />
                </FloatButton>
            </Popover>
            <FloatButton
                tooltip="Add Content"
                onClick={createHandler}
                styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
            >
                <PlusOutlined/>
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
                <ProjectItemHistoryDrawer
                    projectItemId={note.id}
                    projectType={ProjectType.NOTE}
                    editable={content && content.editable}
                />
                {note.editable && <LabelManagement
                    labelEditableHandler={labelEditableHandler}
                    labelEditable={labelEditable}
                />}
                {note.editable && <MoveProjectItem
                    type={ProjectType.NOTE}
                    projectItemId={note.id}
                    mode="icon"
                />}
                <ShareProjectItem
                    type={ProjectType.NOTE}
                    projectItemId={note.id}
                    mode="icon"
                />
                {note.editable && <EditNote note={note} mode="icon"/>}
                {note.deletable && <Tooltip title="Delete">
                    <Popconfirm
                        title="Are you sure?"
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
                </Tooltip>}
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
    content: state.content.content,
    myself: state.myself.username,
    project: state.project.project
});

export default connect(mapStateToProps, {
    deleteNote,
    getNote,
    updateNoteContents,
    deleteContent,
    setDisplayMore,
    setDisplayRevision,
    getProject,
    exportNote,
})(NotePage);
