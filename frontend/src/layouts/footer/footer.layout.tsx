import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

class FooterLayout extends React.Component {
  render() {
    return (
      <Footer className="footer">
        Bullet Journal ©2020 Created by <a href='https://1o24bbs.com'>1024 BBS</a>
      </Footer>
    );
  }
}

export default FooterLayout;
