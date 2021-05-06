// page display contents of notes
// react imports
import React, { useEffect,useState } from 'react';
// features
//actions
import { Note } from '../../features/notes/interface';
// components
import NoteContentList from '../../components/content/content-list.component';
// antd imports
import {Avatar, Button, Divider, Form, message, Modal, Tag, Tooltip} from 'antd';
import './note-page.styles.less';
import 'braft-editor/dist/index.css';
import { ProjectType } from '../../features/project/constants';
import DraggableLabelsList from '../../components/draggable-labels/draggable-label-list.component';
import {Content} from '../../features/myBuJo/interface';
import {inPublicPage} from '../../index';
import {IState} from "../../store";
import {connect} from "react-redux";
import {animation, IconFont, Item, Menu, MenuProvider} from "react-contexify";
import {theme as ContextMenuTheme} from "react-contexify/lib/utils/styles";
import CopyToClipboard from "react-copy-to-clipboard";
import {CopyOutlined, BgColorsOutlined, EnvironmentOutlined, UnorderedListOutlined} from "@ant-design/icons/lib";
import {updateColorSettingShown, setContentsOrder} from '../../features/notes/actions';
import ContentDnd from "../../components/content-dnd/content.dnd.component";


export type NoteProps = {
  note: Note | undefined;
  contents: Content[];
  updateColorSettingShown: (
    visible: boolean
  ) => void;
};

type NoteDetailProps = {
  theme: string;
  labelEditable: boolean;
  noteOperation: Function;
  createContentElem: React.ReactNode;
  noteEditorElem: React.ReactNode;
  isPublic?: boolean;
  setContentsOrder: (
      noteId: number,
      order: number[]
  ) => void;
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
    updateColorSettingShown,
    setContentsOrder,
  } = props;
  const [reorderContentsVisible,setReorderContentsVisible] = useState(false);
  const [contentIdsOnOrder, setContentIdsOnOrder] = useState(props.contents.map(content => content.id))
  useEffect(() => {
    setContentIdsOnOrder(props.contents.map(content => content.id))
  },[props.contents])

  useEffect(() => {
    if (note) {
      document.title = note.name;
    }
  }, [note]);

  const getLocation = (note: Note) => {
    if(!note.location) {
        return null;
    }
    const noteLocation = `Location: ${note.location}`
    return (
        <Tooltip title={noteLocation}>
            <Tag icon={<EnvironmentOutlined />}>{note.location}</Tag>
        </Tooltip>
    );
  };

  const getNoteStatisticsDiv = (note: Note) => {
	if (isPublic) {
		return null;
	}
    if(!note.location) {
      return null;
    }
	return <div
		className="note-statistic-card"
	>
		{getLocation(note)}
	</div>;
  };

  if (!note) return null;

  const bgColorSetting = note.color ? JSON.parse(note.color) : undefined;
  const bgColor = bgColorSetting ? `rgba(${ bgColorSetting.r }, ${ bgColorSetting.g }, ${ bgColorSetting.b }, ${ bgColorSetting.a })` : undefined;

  const setContentsOrderAndCloseModal = () => {
    setContentsOrder(note?.id, contentIdsOnOrder);
    setReorderContentsVisible(false);
  }

  const getReorderContextsModal = () => {
    return(
        <Modal
            destroyOnClose
            centered
            title='Drag to Reorder Contents'
            visible={reorderContentsVisible}
            okText='Confirm'
            onCancel={() => setReorderContentsVisible(false)}
            onOk={() => {
              setContentsOrderAndCloseModal()
            }}
        >
          <div >
            <ContentDnd contents={contents} setContentIdsOnOrder={setContentIdsOnOrder} projectItem={note}/>
          </div>
        </Modal>
    )
  }
  // @ts-ignore
  return (
    <div className={`note-page ${inPublicPage() ? 'publicPage' : ''} ${isPublic ? 'sharedItem' : ''}`} style={{background: bgColor}}>
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

            <Menu id={`note${note.id}`} style={{background:bgColor}}
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
              <Item onClick={() => updateColorSettingShown(true)}>
                  <IconFont style={{fontSize: '14px', paddingRight: '6px'}}><BgColorsOutlined/></IconFont>
                  <span>Set Background Color</span>
              </Item>
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
      <Divider style={{marginTop: '5px', marginBottom: '0px'}}/>
        {getNoteStatisticsDiv(note)}
      <Divider style={{marginTop: '0px'}}/>
      <div className="note-content">
        <div className="content-list">
          {contents.length > 1
          && !isPublic
          && <Tooltip title="Reorder Contents">
            <Button
                type="primary"
                shape="circle"
                icon={<UnorderedListOutlined />}
                onClick={() => setReorderContentsVisible(true)}
                style={{marginBottom: '5px'}}
            />
          </Tooltip>}
          <NoteContentList projectItem={note} contents={contents} />
        </div>
        {getReorderContextsModal()}
        {createContentElem}
      </div>
      {noteEditorElem}
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  theme: state.myself.theme,
});

export default connect(mapStateToProps, {
  updateColorSettingShown,
  setContentsOrder,
})(NoteDetailPage);
