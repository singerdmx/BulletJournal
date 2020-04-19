import React, { useEffect } from 'react';
import { List } from 'antd';
import { ProjectItem } from '../../features/myBuJo/interface';
import { Content } from '../../features/myBuJo/interface';
import ContentItem from './content-item.component';

type ContentListProps = {
  contentEditable?: boolean;
  projectItem: ProjectItem;
  contents: Content[];
};

const ContentList: React.FC<ContentListProps> = ({
  projectItem,
  contents,
  contentEditable,
}) => {
  return (
    <List itemLayout='vertical'>
      {contents &&
        contents.map((content) => (
          <ContentItem
            projectItem={projectItem}
            key={content.id}
            content={content}
            contentEditable={contentEditable}
          />
        ))}
    </List>
  );
};

export default ContentList;
