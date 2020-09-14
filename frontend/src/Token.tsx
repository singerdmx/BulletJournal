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
                <a href={hrefLink}>
                    <img src={logo} alt="Logo" width="200" height="200"/>
                </a>
            </div>
            <h4 style={{textAlign: 'center'}}>
                <div style={{marginTop: '25px'}}>
                    <a href={hrefLink}>
                        <span style={{color: '#F9DBE5'}}>You've successfully logged in</span>
                    </a>
                </div>
                <div style={{marginTop: '15px'}}>
                    <a href={hrefLink}>
                        <img alt='Open Mobile App' width="200px"
                             src="https://user-images.githubusercontent.com/122956/90372021-9d41c880-e024-11ea-9555-ecf4b6590066.png"/>
                    </a>
                </div>
            </h4>
        </div>
    );
};

export default TokenPage;
