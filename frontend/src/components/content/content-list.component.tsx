import React, { useEffect } from 'react';
import { List } from 'antd';
import { connect } from 'react-redux';
import { updateNoteContents } from '../../features/notes/actions';
import { IState } from '../../store';
import { Content } from '../../features/myBuJo/interface';
import ContentItem from './content-item.component';

type ContentListProps = {
  noteId: number;
  contents: Content[];
  updateNoteContents: (noteId: number) => void;
};

const ContentList: React.FC<ContentListProps> = ({
  noteId,
  contents,
  updateNoteContents,
}) => {
  useEffect(() => {
    noteId && updateNoteContents(noteId);
  }, [noteId]);

  return (
    <List itemLayout='vertical'>
      {contents &&
        contents.map((content) => (
          <ContentItem noteId={noteId} key={content.id} content={content} />
        ))}
    </List>
  );
};

const mapStateToProps = (state: IState) => ({
  contents: state.note.contents,
});

export default connect(mapStateToProps, { updateNoteContents })(ContentList);
