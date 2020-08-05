import React from 'react';
import { Content, ProjectItem } from '../../features/myBuJo/interface';
import ContentEditorDrawer from '../content-editor/content-editor-drawer.component';
import RevisionDrawer from '../revision/revision-drawer.component';
import './content-item.styles.less';
import { Project } from '../../features/project/interface';
import { IState } from '../../store';
import { connect } from 'react-redux';
import {
  setDisplayMore,
  setDisplayRevision,
} from '../../features/content/actions';
import Quill, {DeltaStatic} from "quill";
import ReactQuill from "react-quill";
const Delta = Quill.import('delta');

type ContentProps = {
  content: Content;
  targetContent: Content | undefined;
  projectItem: ProjectItem;
  displayMore: boolean;
  displayRevision: boolean;
  setDisplayMore: (displayMore: boolean) => void;
  setDisplayRevision: (displayRevision: boolean) => void;
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
}) => {
  const contentJson = JSON.parse(content.text);
  let delta = contentJson['delta'];
  if (contentJson['diff']) {
    console.log(contentJson['diff'])
    console.log(delta)
    contentJson['diff'].forEach((d: any) => {
      console.log("Applying diff " + JSON.stringify(d));
      delta = new Delta(delta).concat(new Delta(d));
    });

    console.log('new Delta')
    console.log(delta)
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
      <div
        className="content-item-page"
        dangerouslySetInnerHTML={{
          __html: contentHtml ? contentHtml : '<p></p>',
        }}
      />

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
  targetContent: state.content.content
});

export default connect(mapStateToProps, {
  setDisplayMore,
  setDisplayRevision,
})(ContentItem);
