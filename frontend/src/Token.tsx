import React from 'react';

import './styles/main.less';
import * as logo from './assets/favicon466.ico';

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
    <div className="token-page">
      <div className="token-logo">
        <img src={logo} alt="Logo" width="250" height="250" />
      </div>
      <h4>You've successfully logged in.</h4>
      <a href={hrefLink}>
        {`Click to go back to our Bullet Journal
        Mobile App.`}
      </a>
    </div>
  );
};

export default TokenPage;
