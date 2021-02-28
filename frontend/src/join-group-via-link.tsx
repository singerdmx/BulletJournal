import React, {useEffect} from 'react';
import {Result,Button} from 'antd';
import './styles/main.less';
import './public-notifications.styles.less'
import {useParams} from "react-router-dom";
import {getRandomBackgroundImage} from "./assets/background";
import {Group} from './features/group/interface';
import ReactLoading from "react-loading";
import {joinGroupViaLink} from "./features/group/actions";
import {getCookie} from "./index";
import {IState} from "./store";
import {connect} from "react-redux";

type JoinGroupViaLinkProps = {
    group: Group | undefined;
    joinGroupViaLink: (groupUId: string) => void;
};

const Loading = () => (
    <div className='loading'>
        <ReactLoading type='bubbles' color='#0984e3' height='75' width='75'/>
    </div>
);

const JoinGroupViaLinkPage: React.FC<JoinGroupViaLinkProps> = (
    {
        group,
        joinGroupViaLink,
    }) => {
    const {groupUid} = useParams();
    useEffect(() => {
        const loginCookie = getCookie('__discourse_proxy');
        if (groupUid && loginCookie) {
            setTimeout(() => {
                joinGroupViaLink(groupUid);
            }, 1000);
        }
    }, []);

    useEffect(() => {
        if (group) {
            window.location.href = `${window.location.protocol}//${window.location.host}/#/groups/group${group.id}`;
        }
    }, [group]);

    function getResult() {
        const loginCookie = getCookie('__discourse_proxy');
        if (!loginCookie) {
            return <Result
                status="warning"
                title="You need to sign in to join group"
                extra={
                    <Button
                        type="primary"
                        key="login"
                        href="https://bulletjournal.us?ssoLogin=true"
                    >Click to sign in
                    </Button>
                }
            />
        }
        return <Result
            status="success"
            title="You've joined the group"
            subTitle="Redirecting to group page..."
        />
    }

    const fullHeight = global.window.innerHeight;

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

const mapStateToProps = (state: IState) => ({
    group: state.group.group,
});

export default connect(mapStateToProps, {joinGroupViaLink})(
    JoinGroupViaLinkPage
);

