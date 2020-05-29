import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

class FooterLayout extends React.Component {
  render() {
    return (
      <Footer className="footer">
        Bullet Journal ©2020 Powered by <a href='https://1o24bbs.com/c/bulletjournal/108'>1024 BBS</a>
      </Footer>
    );
  }
}

export default FooterLayout;
