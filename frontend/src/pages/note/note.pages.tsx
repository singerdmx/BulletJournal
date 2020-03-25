import React from 'react';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';
import { getNote } from '../../features/notes/actions';
import { IState } from '../../store';
import { Note } from '../../features/notes/interface';
import { Tooltip, Tag } from 'antd';
import { stringToRGB } from '../../features/label/interface';
import { icons } from '../../assets/icons/index';
import { TagOutlined } from '@ant-design/icons';

import './note-page.styles.less';

type NoteProps = {
  note : Note
}

interface NotePageHandler {
  getNote : (noteId : number) => void
}

const NotePage: React.FC<NotePageHandler & NoteProps>  = (props) => {
  const {note} = props;
  const { noteId } = useParams();

  const getIcon = (icon: string) => {
    let res = icons.filter(item => item.name === icon);
    return res.length > 0 ? res[0].icon : <TagOutlined />;
  };

  React.useEffect(() => {
    noteId && props.getNote(parseInt(noteId));
  }, [])
  return (
    <div className="note-page">
      <div className="note-title">
        {note.name}
      </div>
      <div className="note-labels">
        {note.labels && note.labels.map(label => {
            return (
              <Tooltip placement="top" title="Click to Check or Edit" key={label.id}>
                <Tag
                  className="labels"
                  color={stringToRGB(label.value)}
                  style={{ cursor: 'pointer' }}
                >
                  {getIcon(label.icon)} &nbsp;
                  {label.value}
                </Tag>
              </Tooltip>
            );
          })}
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  note: state.note.note
})

export default connect(mapStateToProps, {getNote})(NotePage);
