import React, { useEffect } from 'react';
import { List } from 'antd';
import { connect } from 'react-redux';
import { updateNoteContents } from '../../features/notes/actions';
import { IState } from '../../store';
import { Content } from '../../features/myBuJo/interface';
import NoteContentItem from './content-item.component';

type NoteContentListProps = {
  noteId: number;
  contents: Content[];
  updateNoteContents: (noteId: number) => void;
};

const NoteContentList: React.FC<NoteContentListProps> = ({
  noteId,
  contents,
  updateNoteContents
}) => {
  useEffect(() => {
    noteId && updateNoteContents(noteId);
  }, [noteId]);

  return (
    <List>
      {contents &&
        contents.map(content => (
          <NoteContentItem noteId={noteId} key={content.id} content={content} />
        ))}
    </List>
  );
};

const mapStateToProps = (state: IState) => ({
  contents: state.note.contents
});

export default connect(mapStateToProps, { updateNoteContents })(
  NoteContentList
);
