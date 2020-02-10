import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;
class ContentLayout extends React.Component {
  render() {
    return (
      <Content style={{ padding: '0 24px', minHeight: 280 }}>Content</Content>
    );
  }
}

export default ContentLayout;
