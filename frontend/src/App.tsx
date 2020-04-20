import React from 'react';
import { Layout } from 'antd';
import { ToastContainer } from 'react-toastify';
import SideLayout from './layouts/side/side.layout';
import HeaderLayout from './layouts/header/header.layout';
import ContentLayout from './layouts/content/content.layout';
import FooterLayout from './layouts/footer/footer.layout';

import './styles/main.less';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Layout className="layout">
          <SideLayout />
          <Layout style={{ marginLeft: '250px' }}>
            <HeaderLayout />
            <ContentLayout />
            <ToastContainer />
            <FooterLayout />
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default App;
