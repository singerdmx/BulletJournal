import React from 'react';
import {IState} from './store';
import {connect} from 'react-redux';

import './styles/main.less';
import './Public.styles.less';
import {useParams} from "react-router-dom";

type CollabPageProps = {};

const CollabPage: React.FC<CollabPageProps> = (props) => {
    const {itemId} = useParams();
    return <div>Collab {itemId}</div>;
};

const mapStateToProps = (state: IState) => ({});

export default connect(mapStateToProps, {})(CollabPage);
