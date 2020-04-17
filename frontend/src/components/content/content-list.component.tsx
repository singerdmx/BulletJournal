import React, { useEffect } from 'react';
import { List } from 'antd';
import { ProjectItem } from '../../features/myBuJo/interface';
import { Content } from '../../features/myBuJo/interface';
import ContentItem from './content-item.component';

type ContentListProps = {
  projectItem: ProjectItem;
  contents: Content[];
};

const ContentList: React.FC<ContentListProps> = ({ projectItem, contents }) => {
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

export default ContentList;
