import React from 'react';
import {CustomerServiceOutlined, ExportOutlined, SettingOutlined, UserOutlined} from '@ant-design/icons';
import {Menu} from 'antd';
import {logoutUser} from '../../apis/myselfApis';
import {History} from 'history';

import './dropdown-menu.component.styles.less';
import ContactUs from "../modals/contact-us.component";

const handleLogout = () => {
    logoutUser().then(res => {
        window.location.href = res.headers.get('Location')!;
    });
};

type menuProps = {
    username: string;
    showContactUs: boolean;
    history: History<History.PoorMansUnknown>;
    onCancelShowContactUs: () => void;
    handleContact: () => void;
};

const onClickSetting = (history: History<History.PoorMansUnknown>) => {
    history.push('/settings');
};

const DropdownMenu = (
    {
        username, showContactUs, history, onCancelShowContactUs, handleContact
    }: menuProps) => (
    <Menu selectable={false}>
        <Menu.Item className='modified-item' style={{cursor: 'default'}}>
            <UserOutlined/>
            {username}
        </Menu.Item>
        <Menu.Item className='modified-item' onClick={() => onClickSetting(history)}>
            <SettingOutlined/>
            Settings
        </Menu.Item>
        <Menu.Item className='modified-item' onClick={() => handleContact()}>
            <CustomerServiceOutlined/>
            Contact Us
            <ContactUs visible={showContactUs} onCancel={onCancelShowContactUs}/>
        </Menu.Item>
        <Menu.Item className='modified-item' onClick={() => handleLogout()}>
            <ExportOutlined/>
            Log Out
        </Menu.Item>
    </Menu>
);

export default DropdownMenu;
