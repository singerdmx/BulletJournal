import React, {useEffect, useState} from 'react';
import {Layout} from 'antd';
import Joyride, {CallBackProps, STATUS, Step, StoreHelpers,} from 'react-joyride';
import SideLayout from './layouts/side/side.layout';
import HeaderLayout from './layouts/header/header.layout';
import ContentLayout from './layouts/content/content.layout';
import FooterLayout from './layouts/footer/footer.layout';
import {clearMyself, updateTheme} from './features/myself/actions';
import ReactLoading from 'react-loading';
import getThemeColorVars from './utils/theme';

import './styles/main.less';
import {connect} from 'react-redux';
import {IState} from './store';
import {SAMPLE_TASKS, SELECTIONS, STEPS} from "./pages/templates/steps.pages";

export const Loading = () => (
    <div className="loading">
      <ReactLoading type="bubbles" color="#0984e3" height="75" width="75"/>
    </div>
);

type RootProps = {
  updateTheme: () => void;
  clearMyself: () => void;
  theme: string;
  loading: boolean;
  reload: boolean;
  firstTime: boolean;
};

const App: React.FC<RootProps> = (
    {
      theme,
      reload,
      loading,
      firstTime,
      updateTheme,
      clearMyself
    }) => {
  useEffect(() => {
    updateTheme();
  }, []);

  useEffect(() => {
    const vars = getThemeColorVars(theme);
    window.less.modifyVars(vars).then(() => {
      console.log('Theme updated at first successfully', vars);
    });
  }, [theme]);

  useEffect(() => {
    if (reload) {
      localStorage.removeItem(STEPS);
      localStorage.removeItem(SELECTIONS);
      localStorage.removeItem(SAMPLE_TASKS);
      window.location.reload();
    }
  }, [reload]);

  const [helpers, setHelpers] = useState({});
  const [layoutMarginLeft, setLayoutMarginLeft] = useState(250);

  const steps = [
    {
      title: 'Welcome to Bullet Journal',
      content: <h2>Let's walk the Journey of Bullet Journal</h2>,
      placement: 'center',
      locale: {skip: <strong aria-label="skip">SKIP</strong>},
      target: 'body',
      styles: {
        options: {
          width: 350,
        },
      },
    },
    {
      title: 'Create new group here',
      content: (
          <h4>Invite people to join your group to collaborate and share</h4>
      ),
      spotlightPadding: 30,
      placement: 'bottom',
      target: '#allGroups',
    },
    {
      title: 'Create a new BuJo here',
      content: (
          <h4>'BuJo' is a folder for notes or a project for To-Do list</h4>
      ),
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 0,
      target: '#createNewBuJo',
    },
    {
      title: 'View your created BuJo here',
      content: (
          <h4>You can change ordering or move your BuJo under other BuJo</h4>
      ),
      spotlightPadding: 30,
      target: '#ownBuJos',
    },
    {
      title: 'Create label here',
      content: (
          <h4>Attach label to note or task so you can find them by label</h4>
      ),
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 30,
      target: '#labels',
    },
    {
      title: 'View your settings here',
      content: <h4>You can choose a theme you like</h4>,
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 30,
      target: '#settings',
    },
    {
      title: 'What do you plan to do today?',
      content: <h4>You can view them in Calendar</h4>,
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 30,
      target: '#myBuJo',
    },
  ] as Step[];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const {status, type} = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      clearMyself();
    }
  };

  const getHelpers = (helpers: StoreHelpers) => {
    setHelpers(helpers);
  };

  return loading ? (
      <Loading/>
  ) : (
      <div className="App">
        <Joyride
            callback={handleJoyrideCallback}
            continuous={true}
            getHelpers={getHelpers}
            run={firstTime}
            scrollToFirstStep={true}
            showProgress={true}
            showSkipButton={true}
            steps={steps}
            styles={{
              options: {
                zIndex: 10000,
                primaryColor: '#428bca',
              },
            }}
        />
        <Layout className="layout">
          <SideLayout setLayoutMarginLeft={setLayoutMarginLeft}/>
          <Layout style={{marginLeft: `${layoutMarginLeft}px`}}>
            <HeaderLayout/>
            <ContentLayout/>
            <FooterLayout/>
          </Layout>
        </Layout>
      </div>
  );
};

const mapStateToProps = (state: IState) => ({
  theme: state.myself.theme,
  loading: state.myself.loading,
  firstTime: state.myself.firstTime,
  reload: state.myself.reload
});

export default connect(mapStateToProps, {updateTheme, clearMyself})(App);
