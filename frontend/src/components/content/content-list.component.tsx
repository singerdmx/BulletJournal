import React from 'react';
import { List, Tabs, Avatar, Tooltip } from 'antd';
import { ProjectItem } from '../../features/myBuJo/interface';
import { Content } from '../../features/myBuJo/interface';
import ContentItem from './content-item.component';
import moment from 'moment';

type ContentListProps = {
  contentEditable?: boolean;
  projectItem: ProjectItem;
  contents: Content[];
};

type TabContentProps = {
  content: Content;
};

const TabContent: React.FC<TabContentProps> = ({ content }) => {
  const updateTime = content.updatedAt
    ? moment(content.updatedAt).format('MMM Do YYYY')
    : '';
  return (
    <Tooltip
      title={`${content.owner.alias} ${updateTime}`}
      className="tab-content"
    >
      <Avatar src={content.owner.avatar} />
    </Tooltip>
  );
};

const ContentList: React.FC<ContentListProps> = ({
  projectItem,
  contents,
  contentEditable,
}) => {
  const fullWidth = global.window.innerWidth;
  return (
    <Tabs
      defaultActiveKey="0"
      tabPosition={fullWidth < 768 ? 'top' : 'left'}
      style={{ height: '100%' }}
    >
      {contents &&
        contents.map((content, index) => (
          <Tabs.TabPane
            key={`${index}`}
            tab={<TabContent content={content} />}
            forceRender
          >
            <ContentItem
              projectItem={projectItem}
              key={content.id}
              content={content}
              contentEditable={contentEditable}
            />
          </Tabs.TabPane>
        ))}
    </Tabs>
  );
};

export default ContentList;
