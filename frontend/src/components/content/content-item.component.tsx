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
import 'react-quill/dist/quill.core.css';
import 'react-quill/dist/quill.bubble.css';
import 'react-quill/dist/quill.snow.css';
import {readOnlyModules} from "../content-editor/content-editor-toolbar";
import {ContentType} from "../../features/myBuJo/constants";
import {patchContent as patchNoteContent} from "../../features/notes/actions";
import {
  patchContent as patchTaskContent,
  patchSampleTaskContent
} from "../../features/tasks/actions";
import {
  patchContent as patchTransactionContent
} from "../../features/transactions/actions";

const Delta = Quill.import('delta');

type ContentProps = {
  content: Content;
  targetContent: Content | undefined;
  projectItem: ProjectItem;
  displayMore: boolean;
  displayRevision: boolean;
  setDisplayMore: (displayMore: boolean) => void;
  setDisplayRevision: (displayRevision: boolean) => void;
  patchNoteContent: (
      noteId: number,
      contentId: number,
      text: string,
      diff: string
  ) => void;
  patchTaskContent: (
      taskId: number,
      contentId: number,
      text: string,
      diff: string
  ) => void;
  patchSampleTaskContent: (
      taskId: number,
      contentId: number,
      text: string,
      diff: string
  ) => void;
  patchTransactionContent: (
      transactionId: number,
      contentId: number,
      text: string,
      diff: string
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
  const element = document.createElement('article1');
  const tmpEditor = new ReactQuill.Quill(element, { readOnly: true });
  tmpEditor.setContents(delta);
  return tmpEditor.root.innerHTML;
};

export const convertHtmlToDelta = (html: string) => {
  const element = document.createElement('article2');
  const tmpEditor = new ReactQuill.Quill(element, { readOnly: true });
  return tmpEditor.clipboard.convert(html);
}

const ContentItem: React.FC<ContentProps> = ({
  content,
  targetContent,
  projectItem,
  displayMore,
  displayRevision,
  setDisplayRevision,
  setDisplayMore,
  patchNoteContent,
  patchTransactionContent,
  patchTaskContent,
  patchSampleTaskContent
}) => {
  //general patch content function
  const patchContentCall: { [key in ContentType]: Function } = {
    [ContentType.NOTE]: patchNoteContent,
    [ContentType.TASK]: patchTaskContent,
    [ContentType.TRANSACTION]: patchTransactionContent,
    [ContentType.PROJECT]: () => {
    },
    [ContentType.GROUP]: () => {
    },
    [ContentType.LABEL]: () => {
    },
    [ContentType.CONTENT]: () => {
    },
    [ContentType.SAMPLE_TASK]: patchSampleTaskContent,
  };
  const patchContentFunction = patchContentCall[projectItem.contentType];

  const contentJson = JSON.parse(content.text);
  const delta = contentJson['delta'];
  const contentHtml = contentJson['$$$html$$$'];
  let newDelta : DeltaStatic = new Delta();
  if (contentHtml) {
    console.log('contentHtml', contentHtml);
    contentHtml.split('</p><p>').forEach((p: string) => {
      if (p.startsWith('<p>')) {
        p = p.substring(3);
      }
      if (p.endsWith('</p>')) {
        p = p.substring(0, p.length - 4);
      }
      newDelta = newDelta.concat(convertHtmlToDelta(p));
      newDelta = newDelta.insert('\n');
    });

    console.log('newDelta', newDelta);
    console.log('oldDelta', delta);
    const diff = new Delta(delta).diff(newDelta);
    console.log(diff)
    patchContentFunction(
        projectItem.id,
        content.id,
        JSON.stringify({delta: newDelta}),
        JSON.stringify(diff)
    );
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

  const val : DeltaStatic = new Delta(delta);

  return (
    <div className="content-item-page-container">
        <div className="content-item-page">
          <ReactQuill
              value={val}
              theme="snow"
              readOnly={true}
              modules = {readOnlyModules}
          />
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
  patchNoteContent,
  patchTaskContent,
  patchTransactionContent,
  patchSampleTaskContent
})(ContentItem);
