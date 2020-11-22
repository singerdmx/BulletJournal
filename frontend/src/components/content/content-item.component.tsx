import React from 'react';
import {Content, ProjectItem} from '../../features/myBuJo/interface';
import ContentEditorDrawer from '../content-editor/content-editor-drawer.component';
import RevisionDrawer from '../revision/revision-drawer.component';
import './content-item.styles.less';
import {Project} from '../../features/project/interface';
import {IState} from '../../store';
import {connect} from 'react-redux';
import {setDisplayMore, setDisplayRevision,} from '../../features/content/actions';
import Quill, {DeltaStatic} from "quill";
import ReactQuill from "react-quill";
import {patchTransactionRevisionContents} from "../../features/transactions/actions";
import {patchTaskRevisionContents} from "../../features/tasks/actions";
import {patchNoteRevisionContents} from "../../features/notes/actions";
import {ContentType} from "../../features/myBuJo/constants";
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.snow.css';

const Delta = Quill.import('delta');

type ContentProps = {
  content: Content;
  targetContent: Content | undefined;
  projectItem: ProjectItem;
  displayMore: boolean;
  displayRevision: boolean;
  setDisplayMore: (displayMore: boolean) => void;
  setDisplayRevision: (displayRevision: boolean) => void;
  patchNoteRevisionContents: (
      noteId: number,
      contentId: number,
      revisionContents: string[],
      etag: string
  ) => void;
  patchTaskRevisionContents: (
      taskId: number,
      contentId: number,
      revisionContents: string[],
      etag: string
  ) => void;
  patchTransactionRevisionContents: (
      transactionId: number,
      contentId: number,
      revisionContents: string[],
      etag: string
  ) => void;
};

export const isContentEditable = (
  project: Project,
  projectItem: ProjectItem,
  content: Content,
  myself: string
) => {
  return (
    project.owner.name === myself ||
    projectItem.owner.name === myself ||
    content.owner.name === myself
  );
};

export const createHTML = (delta: DeltaStatic) => {
  const element = document.createElement('article');
  const tmpEditor = new ReactQuill.Quill(element, { readOnly: true });
  tmpEditor.setContents(delta);
  return tmpEditor.root.innerHTML;
};

const ContentItem: React.FC<ContentProps> = ({
  content,
  targetContent,
  projectItem,
  displayMore,
  displayRevision,
  setDisplayRevision,
  setDisplayMore,
  patchNoteRevisionContents,
  patchTaskRevisionContents,
  patchTransactionRevisionContents
}) => {
  const contentJson = JSON.parse(content.text);
  let delta = contentJson['delta'];
  if (contentJson['diff']) {
    let revisionContents = [content.text];
    if (!contentJson['###html###']) {
      // first time opened by web and created by mobile
      const c0 = JSON.stringify({delta: delta, '###html###': createHTML(new Delta(delta))});
      revisionContents = [c0, c0]; // first revision
    }
    console.log(contentJson['diff'])
    console.log(delta)
    contentJson['diff'].forEach((d: any) => {
      console.log("Applying diff " + JSON.stringify(d));
      delta = new Delta(delta).compose(new Delta(d));
      revisionContents.push(JSON.stringify({delta: delta, '###html###': createHTML(new Delta(delta))}));
    });

    console.log('new Delta', delta)
    console.log('revisionContents', revisionContents);
    switch (projectItem.contentType) {
      case ContentType.TASK:
        patchTaskRevisionContents(projectItem.id, content.id, revisionContents, content.etag);
        break;
      case ContentType.NOTE:
        patchNoteRevisionContents(projectItem.id, content.id, revisionContents, content.etag);
        break;
      case ContentType.TRANSACTION:
        patchTransactionRevisionContents(projectItem.id, content.id, revisionContents, content.etag);
        break;
    }
  }

  let contentHtml = contentJson['###html###'];
  if (!contentHtml) {
    contentHtml = createHTML(new Delta(delta));
  }

  const handleRevisionClose = () => {
    setDisplayRevision(false);
  };

  const handleClose = () => {
    setDisplayMore(false);
  };

  const isDisplayMore = () => {
    if (!displayMore) {
      return false;
    }

    if (!targetContent) {
      return false;
    }

    return targetContent.id === content.id;
  }

  const isDisplayRevision = () => {
    if (!displayRevision) {
      return false;
    }

    if (!targetContent) {
      return false;
    }

    return targetContent.id === content.id;
  }

  return (
    <div className="content-item-page-contianer">
      <div className="ql-container ql-snow" style={{position: 'relative', borderWidth: '0', width: '100%'}}>
        <div className="ql-editor" data-gramm="false" contentEditable="false">
          <div
            className="content-item-page"
            dangerouslySetInnerHTML={{
              __html: contentHtml ? contentHtml : '<p></p>',
            }}
          />
        </div>
      </div>

      <ContentEditorDrawer
        delta={delta}
        visible={isDisplayMore()}
        onClose={handleClose}
        projectItem={projectItem}
      />
      <RevisionDrawer
        revisionDisplay={isDisplayRevision()}
        onClose={handleRevisionClose}
        revisions={content.revisions}
        projectItem={projectItem}
        content={content}
      />
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  displayMore: state.content.displayMore,
  displayRevision: state.content.displayRevision,
  targetContent: state.content.content,
});

export default connect(mapStateToProps, {
  setDisplayMore,
  setDisplayRevision,
  patchNoteRevisionContents,
  patchTaskRevisionContents,
  patchTransactionRevisionContents
})(ContentItem);
