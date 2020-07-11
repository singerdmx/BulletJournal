import React from 'react';

import './styles/main.less';
import './Public.styles.less';
import {getRandomBackgroundImage} from './assets/background';

type PageProps = {};

const TokenPage: React.FC<PageProps> = (props) => {

    return (
        <div
            style={{
                backgroundImage: `url(${getRandomBackgroundImage()})`,
            }}
            className="public-container"
        >

        </div>
    );

};


export default TokenPage;
