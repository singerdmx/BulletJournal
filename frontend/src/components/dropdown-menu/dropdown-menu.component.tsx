import React from 'react';
import {
    AndroidOutlined,
    AppleOutlined,
    CustomerServiceOutlined,
    ExportOutlined,
    GlobalOutlined,
    MailOutlined,
    UserOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import {Menu} from 'antd';
import {logoutUser} from '../../apis/myselfApis';
import {History} from 'history';

import './dropdown-menu.component.styles.less';
import ContactUs from '../modals/contact-us.component';
import {connect} from 'react-redux';
import {IState} from '../../store';

export const handleLogout = () => {
    logoutUser().then((res) => {
        if (caches) {
            // Service worker cache should be cleared with caches.delete()
            caches.keys().then(function (names) {
                for (let name of names) caches.delete(name).then(r => console.log(r));
            });
        }
        window.location.href = res.headers.get('Location')!;
    });
};

type menuProps = {
    points: number;
    username: string;
    showContactUs: boolean;
    history: History<History.PoorMansUnknown>;
    onCancelShowContactUs: (e: any) => void;
    handleContact: () => void;
};

const onClickTemplates = (history: History<History.PoorMansUnknown>) => {
    history.push('/punchCard');
};

const onClickPoint = (history: History<History.PoorMansUnknown>) => {
    history.push('/points');
};

const DropdownMenu = ({
                          username,
                          points,
                          showContactUs,
                          history,
                          onCancelShowContactUs,
                          handleContact,
                      }: menuProps) => (
    <Menu selectable={false}>
        <Menu.Item className='modified-item' style={{cursor: 'default'}}>
            <UserOutlined/>
            {username}
        </Menu.Item>
        <Menu.Item
            className='modified-item'
            onClick={() => onClickTemplates(history)}
        >
            <GlobalOutlined />
            Templates
        </Menu.Item>
        <Menu.Item
            className='modified-item'
            onClick={() =>
                (window.location.href = `https://1o24bbs.com/u/${username}/messages`)
            }
        >
            <MailOutlined/>
            Messages
        </Menu.Item>
        <Menu.Item className='modified-item' onClick={() => handleContact()}>
            <CustomerServiceOutlined/>
            Contact Us
            <ContactUs visible={showContactUs} onCancel={onCancelShowContactUs}/>
        </Menu.Item>
        <Menu.Item className='modified-item'
                   onClick={() => onClickPoint(history)}>
            <WalletOutlined/>
            <strong>{points}</strong>&nbsp;Points
        </Menu.Item>
        <Menu.Item
            className='modified-item'
            onClick={() =>
                (window.location.href = 'https://play.google.com/store/apps/details?id=us.bullet_journal')
            }
        >
            <AndroidOutlined />
            Android App
        </Menu.Item>
        <Menu.Item
            className='modified-item'
            onClick={() =>
                (window.location.href = 'https://apps.apple.com/us/app/id1529692136')
            }
        >
            <AppleOutlined />
            iOS App
        </Menu.Item>
        <Menu.Item className='modified-item' onClick={() => handleLogout()}>
            <ExportOutlined/>
            Log Out
        </Menu.Item>
    </Menu>
);

const mapStateToProps = (state: IState) => ({
    points: state.myself.points,
});

export default connect(mapStateToProps, {})(DropdownMenu);
