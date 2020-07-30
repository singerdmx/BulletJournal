import React from 'react';
import {Content, ProjectItem} from '../../features/myBuJo/interface';
import ContentEditorDrawer from '../content-editor/content-editor-drawer.component';
import RevisionDrawer from '../revision/revision-drawer.component';
import moment from 'moment';
import './content-item.styles.less';
import {Project} from '../../features/project/interface';
import {IState} from '../../store';
import {connect} from 'react-redux';
import {setDisplayMore, setDisplayRevision} from "../../features/content/actions";

type ContentProps = {
  content: Content;
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

const ContentItem: React.FC<ContentProps> = ({
  content,
  projectItem,
  displayMore,
  displayRevision,
  setDisplayRevision,
  setDisplayMore
}) => {
  const contentHtml = JSON.parse(content.text)['###html###'];

  const createdTime = content.createdAt
    ? moment(content.createdAt).fromNow()
    : '';
  const updateTime = content.updatedAt
    ? moment(content.updatedAt).format('MMM Do YYYY')
    : '';

  const handleRevisionClose = () => {
    setDisplayRevision(false);
  };

  const handleClose = () => {
    setDisplayMore(false);
  };

  return (
    <div className="content-item-page-contianer">
      <div
        className="content-item-page"
        dangerouslySetInnerHTML={{
          __html: contentHtml ? contentHtml : '<p></p>',
        }}
      />

      <ContentEditorDrawer
        content={content}
        visible={displayMore}
        onClose={handleClose}
        projectItem={projectItem}
      />
      <RevisionDrawer
        revisionDisplay={displayRevision}
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
});

export default connect(mapStateToProps, {
  setDisplayMore,
  setDisplayRevision
})(ContentItem);
