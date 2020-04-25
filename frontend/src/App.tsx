import React, { useEffect } from 'react';
import { Layout } from 'antd';
import SideLayout from './layouts/side/side.layout';
import HeaderLayout from './layouts/header/header.layout';
import ContentLayout from './layouts/content/content.layout';
import FooterLayout from './layouts/footer/footer.layout';
import { updateTheme } from './features/myself/actions';
import getThemeColorVars from './utils/theme';

import './styles/main.less';
import { connect } from 'react-redux';
import { IState } from './store';

type RootProps = {
  updateTheme: () => void;
  theme: string;
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
  }, [props.theme]);

  return (
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
