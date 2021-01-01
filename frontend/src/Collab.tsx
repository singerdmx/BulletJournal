import React from 'react';
import {IState} from './store';
import {connect} from 'react-redux';

import './styles/main.less';
import './Public.styles.less';

type CollabPageProps = {};

const CollabPage: React.FC<CollabPageProps> = (props) => {
    return <div style={{ display: 'flex', justifyContent: 'center' }}>
        <img alt='Coming Soon'
             src='https://user-images.githubusercontent.com/122956/92905797-d299c600-f3d8-11ea-813a-3ac75c2f5677.gif'/>
    </div>;
};

const mapStateToProps = (state: IState) => ({});

export default connect(mapStateToProps, {})(CollabPage);
