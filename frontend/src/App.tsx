import React from 'react';
import { Layout, Menu, Input } from 'antd';
import './App.css';

const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Layout className="layout">
          <Sider width={200} style={{ background: '#fff' }}>
            <div className="icon">
              <img src="favicon466.ico" alt="Icon" className="icon-img" />
            </div>
            <Menu
              mode="inline"
              defaultSelectedKeys={['main']}
              style={{height: '100%' }}
            >
              <Menu.Item key="main">Today</Menu.Item>
              <Menu.Item key="next">Next 7 days</Menu.Item>
              <Menu.Item key="next">Projects</Menu.Item>
              <Menu.Item key="next">Groups</Menu.Item>
              <Menu.Item key="next">Labels</Menu.Item>
            </Menu>
          </Sider>
            <Layout>
              <Header className="header">
                <div className="search-box">
                  <Search />
                </div>
                <div>User Info</div>
              </Header>
              <Content style={{ padding: '0 24px', minHeight: 280 }}>
                Content
              </Content>
              <Footer style={{ textAlign: 'center' }}>
                Bullet Journal ©2020 Created by{' '}
              </Footer>
            </Layout>
        </Layout>
      </div>
    );
  }
}

export default App;
