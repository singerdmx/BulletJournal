import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

class FooterLayout extends React.Component {
  render() {
    return (
      <Footer className="footer">
        Bullet Journal ©2020 Created by 1024 BBS
      </Footer>
    );
  }
}

export default FooterLayout;
