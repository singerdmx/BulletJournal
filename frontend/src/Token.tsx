import React from 'react';

import './styles/main.less';
import * as logo from './assets/favicon466.ico';
import {logoutUser} from "./apis/myselfApis";

type PageProps = {};

const TokenPage: React.FC<PageProps> = (props) => {
    const handleLogout = () => {
        logoutUser().then((res) => {
            window.location.href = 'https://1o24bbs.com';
        });
    };

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
                        <img width="200px"
                             src="https://user-images.githubusercontent.com/122956/90372021-9d41c880-e024-11ea-9555-ecf4b6590066.png"/>
                    </a>
                </div>
            </h4>
            <br/>
            <br/>
            <br/>
            <a>
                <img width="80px"
                     onClick={handleLogout}
                     src='https://user-images.githubusercontent.com/122956/90494251-270e9600-e0f8-11ea-8872-45df9b24c6bb.png'/>
            </a>
        </div>
    );
};

export default TokenPage;
