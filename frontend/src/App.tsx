import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { ToastContainer } from 'react-toastify';
import SideLayout from './layouts/side/side.layout';
import HeaderLayout from './layouts/header/header.layout';
import ContentLayout from './layouts/content/content.layout';
import FooterLayout from './layouts/footer/footer.layout';
import { updateExpandedMyself } from './features/myself/actions';

import './styles/main.less';
import { connect } from 'react-redux';
import { IState } from './store';

type RootProps = {
  updateExpandedMyself: (updateSettings: boolean) => void;
  theme: string;
};

const App: React.FC<RootProps> = (props) => {
  useEffect(() => {
    props.updateExpandedMyself(true);
  }, []);

  useEffect(() => {
    let themeColor = '';
    switch (props.theme) {
      case 'LIGHT': {
        themeColor = '#428bca';
        break;
      }
      case 'PINK': {
        themeColor = '#f5aac9';
        break;
      }
      case 'DARK': {
        break;
      }
    }
    window.less.modifyVars({ '@primary-color': themeColor }).then(() => {
      console.log('Theme updated successfully', themeColor);
    });
  }, [props.theme]);

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
};

const mapStateToProps = (state: IState) => ({
  theme: state.myself.theme,
});

export default connect(mapStateToProps, { updateExpandedMyself })(App);
