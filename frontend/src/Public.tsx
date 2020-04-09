import React from 'react';
import {useParams} from "react-router-dom";
import {IState} from "./store";
import {connect} from "react-redux";
import {Note} from "./features/notes/interface";
import {Task} from "./features/tasks/interface";
import {ContentType} from "./features/myBuJo/constants";
import {Content} from "./features/myBuJo/interface";
import {getPublicItem} from "./features/system/actions";

import './App.less';
import TaskPage from "./pages/task/task.pages";
import NotePage from "./pages/note/note.pages";

type PageProps = {
  note: Note;
  task: Task;
  contentType: ContentType;
  contents: Content[];
  getPublicItem: (itemId: string) => void;
};

const PublicPage: React.FC<PageProps> = (props) => {
  const { note, task, contentType, contents } = props;
  const { itemId } = useParams();
  React.useEffect(() => {
    props.getPublicItem(itemId!);
  }, []);

  if (contentType === ContentType.TASK) {
    return <div>
      <TaskPage />
    </div>;
  }

  if (contentType === ContentType.NOTE) {
    return <div>
      <NotePage />
    </div>;
  }

  return null;
};

const mapStateToProps = (state: IState) => ({
  note: state.system.publicNote,
  task: state.system.publicTask,
  contentType: state.system.contentType,
  contents: state.system.contents
});

export default connect(mapStateToProps, {getPublicItem}) (PublicPage);
