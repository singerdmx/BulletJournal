import React from 'react';

import {Result} from 'antd';
import './styles/main.less';
import './public-notifications.styles.less'
import {useParams} from "react-router-dom";
import {getRandomBackgroundImage} from "./assets/background";
import {useLocation} from "react-use";
import ReactLoading from "react-loading";
import {answerPublicNotification} from "./apis/notificationApis";
import {getCookie} from "./index";

type PublicNotificationsProps = {};

const Loading = () => (
    <div className='loading'>
      <ReactLoading type='bubbles' color='#0984e3' height='75' width='75'/>
    </div>
);

const PublicNotificationsPage: React.FC<PublicNotificationsProps> = (props) => {
  const {id} = useParams();
  const location = useLocation();

  const handleAnswer = (id: string, action: string) => {
    answerPublicNotification(id, action).then((res) => {
      const loginCookie = getCookie('__discourse_proxy');
      if (!loginCookie) {
        window.location.href = 'https://bulletjournal.us/home/index.html';
      } else {
        window.location.href = 'https://bulletjournal.us';
      }
    });
  };

  if (id && location.search) {
    const action = location.search.substring(8).toLowerCase(); // location.search = ?action=
    console.log(`/api/public/notifications/${id}/answer?action=${action}`);
    setTimeout(() => {
      handleAnswer(id, action);
    }, 3000);
  }

  const fullHeight = global.window.innerHeight;

  function getResult() {
    if (!location.search) {
      return null;
    }
    const action = location.search.substring(8).toLowerCase(); // location.search = ?action=
    if (action === 'accept') {
      return <Result
          status="success"
          title="You've accepted the invitation"
          subTitle="Redirecting to home page..."
      />
    }
    return <Result
        status="error"
        title="You've declined the invitation"
        subTitle="Redirecting to home page..."
    />;
  }

  return <div
      style={{backgroundImage: `url(${getRandomBackgroundImage()})`, height: `${fullHeight}px`}}
      className='public-container'
  >
    <Loading/>
    <div className='public-notifications-page'>
      {getResult()}
    </div>
  </div>
};

export default PublicNotificationsPage;
