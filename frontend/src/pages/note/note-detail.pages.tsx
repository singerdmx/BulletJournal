// page display contents of notes
// react imports
import React, { useEffect } from 'react';
// features
//actions
import { Note } from '../../features/notes/interface';
// components
import NoteContentList from '../../components/content/content-list.component';
// antd imports
import {Avatar, Divider, message, Tooltip} from 'antd';
import './note-page.styles.less';
import 'braft-editor/dist/index.css';
import { ProjectType } from '../../features/project/constants';
import DraggableLabelsList from '../../components/draggable-labels/draggable-label-list.component';
import { Content } from '../../features/myBuJo/interface';
import { inPublicPage } from '../../index';
import {IState} from "../../store";
import {connect} from "react-redux";
import {animation, IconFont, Item, Menu, MenuProvider} from "react-contexify";
import {theme as ContextMenuTheme} from "react-contexify/lib/utils/styles";
import CopyToClipboard from "react-copy-to-clipboard";
import {CopyOutlined} from "@ant-design/icons/lib";

export type NoteProps = {
  note: Note | undefined;
  contents: Content[];
};

type NoteDetailProps = {
  theme: string;
  labelEditable: boolean;
  noteOperation: Function;
  createContentElem: React.ReactNode;
  noteEditorElem: React.ReactNode;
  isPublic?: boolean;
};

const NoteDetailPage: React.FC<NoteProps & NoteDetailProps> = (props) => {
  const {
    note,
    theme,
    labelEditable,
    noteOperation,
    noteEditorElem,
    createContentElem,
    contents,
    isPublic,
  } = props;
  useEffect(() => {
    if (note) {
      document.title = note.name;
    }
  }, [note]);
  if (!note) return null;
  return (
    <div className={`note-page ${inPublicPage() ? 'publicPage' : ''} ${isPublic ? 'sharedItem' : ''}`}>
      <Tooltip
        placement="top"
        title={`${note.owner.alias}`}
        className="note-avatar"
      >
        <span>
          <Avatar size="large" src={note.owner.avatar} />
        </span>
      </Tooltip>

      <div className="note-title">
        <div className="label-and-name">
          <>
            <MenuProvider id={`note${note.id}`}>
              <span>{note.name}</span>
            </MenuProvider>

            <Menu id={`note${note.id}`}
                  theme={theme === 'DARK' ? ContextMenuTheme.dark : ContextMenuTheme.light}
                  animation={animation.zoom}>
              <CopyToClipboard
                  text={`${note.name} ${window.location.origin.toString()}/#/note/${note.id}`}
                  onCopy={() => message.success('Link Copied to Clipboard')}
              >
                <Item>
                  <IconFont style={{fontSize: '14px', paddingRight: '6px'}}><CopyOutlined/></IconFont>
                  <span>Copy Link Address</span>
                </Item>
              </CopyToClipboard>
            </Menu>
          </>
          <DraggableLabelsList
            mode={ProjectType.NOTE}
            labels={note.labels}
            editable={labelEditable}
            itemId={note.id}
            itemShared={note.shared}
          />
        </div>

        {noteOperation()}
      </div>
      <Divider />
      <div className="note-content">
        <div className="content-list">
          <NoteContentList projectItem={note} contents={contents} />
        </div>
        {createContentElem}
      </div>
      {noteEditorElem}
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  theme: state.myself.theme,
});

export default connect(mapStateToProps, {})(NoteDetailPage);
