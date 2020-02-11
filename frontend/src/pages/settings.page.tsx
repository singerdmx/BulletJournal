import React from 'react';
import { Layout } from 'antd';
import { ToastContainer } from 'react-toastify';
import HeaderLayout from '../layouts/header/header.layout';
import ContentLayout from '../layouts/content/content.layout';
import FooterLayout from '../layouts/footer/footer.layout';

const SettingPage = () => {
  return (
    <Layout className="layout">
        <HeaderLayout />
        <ContentLayout />
        <ToastContainer />
        <FooterLayout />
    </Layout>
  );
};

export default SettingPage;
