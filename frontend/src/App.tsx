import React, {useEffect, useState} from 'react';
import {Layout} from 'antd';
import Joyride, {CallBackProps, STATUS, Step, StoreHelpers} from 'react-joyride';
import SideLayout from './layouts/side/side.layout';
import HeaderLayout from './layouts/header/header.layout';
import ContentLayout from './layouts/content/content.layout';
import FooterLayout from './layouts/footer/footer.layout';
import {updateTheme} from './features/myself/actions';
import ReactLoading from 'react-loading';
import getThemeColorVars from './utils/theme';

import './styles/main.less';
import {connect} from 'react-redux';
import {IState} from './store';

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
  }, [props.theme]);

  const [run, setRun] = useState(true);
  const [helpers, setHelpers] = useState({});

  const steps = [
    {
      title: 'Welcome to Bullet Journal',
      content: <h2>Let's walk the Journey of Bullet Journal</h2>,
      placement: 'center',
      locale: {skip: <strong aria-label="skip">SKIP</strong>},
      target: 'body',
      styles: {
        options: {
          width: 420,
        },
      },
    },
    {
      title: 'Create new group here',
      content: <h4>Invite people to join your group to collaborate and share</h4>,
      placement: 'bottom',
      target: '#allGroups',
    },
    {
      title: 'Create a new BuJo here',
      content: <h4>'BuJo' is a folder for notes or a project for To-Do list</h4>,
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 20,
      target: '#createNewBuJo',
    },
    {
      title: 'View your created BuJo here',
      content: <h4>You can change ordering or move your BuJo under other BuJo</h4>,
      target: '#ownBuJos',
    },
    {
      title: 'Create label here',
      content: <h4>Attach label to note or task so you can find them by label</h4>,
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 20,
      target: '#labels',
    },
    {
      title: 'View your settings here',
      content: <h4>You can choose a theme you like</h4>,
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 20,
      target: '#settings',
    },
    {
      title: 'What do you plan to do today?',
      content: <h4>You can view them in Calendar</h4>,
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 20,
      target: '#myBuJo',
    },
  ] as Step[];

  const handleJoyrideCallback = (data: CallBackProps) => {
      const { status, type } = data;
      const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

      if (finishedStatuses.includes(status)) {
        setRun(false);
      }

      console.log(data);
  };

  const getHelpers = (helpers: StoreHelpers) => {
    setHelpers(helpers);
  };

  return props.loading ? (
    <Loading />
  ) : (
    <div className="App">
      <Joyride
          callback={handleJoyrideCallback}
          continuous={true}
          getHelpers={getHelpers}
          run={run}
          scrollToFirstStep={true}
          showProgress={true}
          showSkipButton={true}
          steps={steps}
          styles={{
            options: {
              zIndex: 10000,
            },
          }}
      />
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
