import React from 'react';

import './styles/main.less';
import './public-notifications.styles.less'
import {useParams} from "react-router-dom";
import {getRandomBackgroundImage} from "./assets/background";
import {useLocation} from "react-use";

type PublicNotificationsProps = {};

const PublicNotificationsPage: React.FC<PublicNotificationsProps> = (props) => {
  const {id} = useParams();
  const location = useLocation();
  const fullHeight = global.window.innerHeight;
  return <div
      style={{backgroundImage: `url(${getRandomBackgroundImage()})`, height: `${fullHeight}px`}}
      className='public-container'
  >
    <div className='public-notifications-page'>
      {id}
      <br/>
      {location.search}
    </div>
  </div>
};

export default PublicNotificationsPage;
