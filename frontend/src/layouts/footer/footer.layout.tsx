import React from 'react';
import {Layout} from 'antd';

const {Footer} = Layout;

class FooterLayout extends React.Component {
  render() {
    return (
        <Footer className="footer">
          <div className="col-lg-4 col-md-12 col-xs-12">
            Bullet Journal ©2020 Powered by{' '}
            <a href="https://1o24bbs.com/c/bulletjournal/108">1024 BBS</a>
          </div>
          <div className="col-lg-4 col-md-6 col-xs-12">
            <a href="https://bulletjournal.us/public/privacy">Privacy Policy</a>
          </div>
          <div className="col-lg-4 col-md-6 col-xs-12">
            <a href="https://bulletjournal.us/public/tos">Terms of Service</a>
          </div>
        </Footer>
    );
  }
}

export default FooterLayout;
