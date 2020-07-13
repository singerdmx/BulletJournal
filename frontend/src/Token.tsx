import React from 'react';

import './styles/main.less';
import './Public.styles.less';
import { getRandomBackgroundImage } from './assets/background';

type PageProps = {};

const TokenPage: React.FC<PageProps> = (props) => {
  let userAgent = navigator.userAgent || navigator.vendor;
  let hrefLink = '';
  if (/android/i.test(userAgent)) {
    hrefLink = 'intent://bulletjournal.us/#Intent;scheme=bullet;end';
  }
  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent)) {
    hrefLink = 'bullet://bulletjournal.us';
  }

  return (
    <div
      style={{
        backgroundImage: `url(${getRandomBackgroundImage()})`,
      }}
      className="public-container"
    >
      <a href={hrefLink}>
        You've successfully logged in. Now please go to our Bullet Journal Mobile
        App.
      </a>
    </div>
  );
};

export default TokenPage;
