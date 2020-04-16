import React, { useEffect } from 'react';
import { List } from 'antd';
import { connect } from 'react-redux';
import { ProjectItem } from '../../features/myBuJo/interface';
import { updateNoteContents } from '../../features/notes/actions';
import { IState } from '../../store';
import { Content } from '../../features/myBuJo/interface';
import ContentItem from './content-item.component';

type ContentListProps = {
  projectItem: ProjectItem;
  contents: Content[];
  updateNoteContents: (noteId: number) => void;
};

const ContentList: React.FC<ContentListProps> = ({
  projectItem,
  contents,
  updateNoteContents,
}) => {
  useEffect(() => {
    projectItem && projectItem.id && updateNoteContents(projectItem.id);
  }, [projectItem]);

  return (
    <List itemLayout='vertical'>
      {contents &&
        contents.map((content) => (
          <ContentItem
            projectItem={projectItem}
            key={content.id}
            content={content}
          />
        ))}
    </List>
  );
};

const mapStateToProps = (state: IState) => ({
  contents: state.note.contents,
});

export default connect(mapStateToProps, { updateNoteContents })(ContentList);
