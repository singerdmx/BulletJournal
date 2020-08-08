import React from 'react';
import {Avatar, Popover, Tabs} from 'antd';
import {Content, ProjectItem} from '../../features/myBuJo/interface';
import ContentItem from './content-item.component';
import moment from 'moment';
import {connect} from "react-redux";
import {updateTargetContent} from "../../features/content/actions";
import {IState} from "../../store";

type ContentListProps = {
  contentEditable?: boolean;
  projectItem: ProjectItem;
  contents: Content[];
  content: Content | undefined;
  updateTargetContent: (content: Content | undefined) => void;
};

type TabContentProps = {
  content: Content;
};

const TabContent: React.FC<TabContentProps> = ({content}) => {
  const updateTime = content.updatedAt
      ? `${moment(content.updatedAt).format('MMM Do YYYY')} (${moment(content.updatedAt).fromNow()})`
      : '';
  return (
      <Popover
          placement="right"
          title={content.owner.alias}
          content={updateTime}
      ><Avatar src={content.owner.avatar} size='small'/>
      </Popover>
  );
};

const ContentList: React.FC<ContentListProps> = ({
  projectItem,
  contents,
  content,
  updateTargetContent
}) => {
  const onTabClick = (key: string, e: MouseEvent) => {
    updateTargetContent(contents.filter(c => c.id.toString() === key)[0]);
  };

  if (!contents || contents.length === 0) {
    return null;
  }

  if (contents.length === 1) {
    return <ContentItem
        projectItem={projectItem}
        key={contents[0].id}
        content={contents[0]}
    />
  }

  return (
      <Tabs
          activeKey={content ? content.id.toString() : ''}
          tabPosition='left'
          style={{height: '100%'}}
          onTabClick={onTabClick}
      >
        {contents.map((c, index) => (
            <Tabs.TabPane
                key={`${c.id}`}
                tab={<TabContent content={c}/>}
                forceRender
            >
              <ContentItem
                  projectItem={projectItem}
                  key={c.id}
                  content={c}
              />
            </Tabs.TabPane>
        ))}
      </Tabs>
  );
};

const mapStateToProps = (state: IState) => ({
  content: state.content.content,
});

export default connect(mapStateToProps, {updateTargetContent})(ContentList);
