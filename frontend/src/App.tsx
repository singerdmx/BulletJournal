import React, { useEffect } from 'react';
import { Layout } from 'antd';
import SideLayout from './layouts/side/side.layout';
import HeaderLayout from './layouts/header/header.layout';
import ContentLayout from './layouts/content/content.layout';
import FooterLayout from './layouts/footer/footer.layout';
import { updateTheme } from './features/myself/actions';
import ReactLoading from 'react-loading';
import getThemeColorVars from './utils/theme';

import './styles/main.less';
import { connect } from 'react-redux';
import { IState } from './store';

export const Loading = () => (
  <div className="loading">
    <ReactLoading type="bubbles" color="#0984e3" height="75" width="75" />
  </div>
);

type RootProps = {
  updateTheme: () => void;
  theme: string;
  loading: boolean;
};

const App: React.FC<RootProps> = (props) => {
  useEffect(() => {
    props.updateTheme();
  }, []);

  useEffect(() => {
    const vars = getThemeColorVars(props.theme);
    window.less.modifyVars(vars).then(() => {
      console.log('Theme updated at first successfully', vars);
    });
    const app = document.querySelector('div.App');
    console.log(app);
    if (!app) {
      console.log('reloading');
    }
  }, [props.theme]);

  return props.loading ? (
    <Loading />
  ) : (
    <div className="App">
      <Layout className="layout">
        <SideLayout />
        <Layout style={{ marginLeft: '250px' }}>
          <HeaderLayout />
          <ContentLayout />
          <FooterLayout />
        </Layout>
      </Layout>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  theme: state.myself.theme,
  loading: state.myself.loading,
});

export default connect(mapStateToProps, { updateTheme })(App);
