import React from 'react';
import { Layout } from 'antd';
import { ToastContainer } from 'react-toastify';
import SideLayout from '../layouts/side/side.layout';
import HeaderLayout from '../layouts/header/header.layout';
import ContentLayout from '../layouts/content/content.layout';
import FooterLayout from '../layouts/footer/footer.layout';

const HomePage = () => {
  return (
    <Layout className="layout">
      <SideLayout />
      <Layout style={{ marginLeft: '250px' }}>
        <HeaderLayout />
        <ContentLayout />
        <ToastContainer />
        <FooterLayout />
      </Layout>
    </Layout>
  );
};

export default HomePage;
