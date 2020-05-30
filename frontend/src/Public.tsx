import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IState } from './store';
import { connect } from 'react-redux';
import { Note } from './features/notes/interface';
import { Task } from './features/tasks/interface';
import { ContentType } from './features/myBuJo/constants';
import { Content } from './features/myBuJo/interface';
import { getPublicItem } from './features/system/actions';

import './styles/main.less';
import TaskDetailPage from './pages/task/task-detail.pages';
import NoteDetailPage from './pages/note/note-detail.pages';

type PageProps = {
  note: Note;
  task: Task;
  contentType: ContentType | undefined;
  contents: Content[];
  getPublicItem: (itemId: string) => void;
};

const PublicPage: React.FC<PageProps> = (props) => {
  const { note, task, contentType, contents, getPublicItem } = props;
  const { itemId } = useParams();
  useEffect(() => {
    getPublicItem(itemId!);
  }, []);

  if (!contentType) {
    return null;
  }

  if (contentType === ContentType.TASK) {
    return (
      <div>
        <TaskDetailPage
          task={task}
          labelEditable={false}
          taskOperation={() => null}
          contents={contents}
          createContentElem={null}
          taskEditorElem={null}
        />
      </div>
    );
  }

  if (contentType === ContentType.NOTE) {
    return (
      <div>
        <NoteDetailPage
          note={note}
          labelEditable={false}
          createContentElem={null}
          noteOperation={() => null}
          noteEditorElem={null}
          contents={contents}
        />
      </div>
    );
  }

  return null;
};

const mapStateToProps = (state: IState) => ({
  note: state.system.publicNote,
  task: state.system.publicTask,
  contentType: state.system.contentType,
  contents: state.system.contents,
});

export default connect(mapStateToProps, { getPublicItem })(PublicPage);
