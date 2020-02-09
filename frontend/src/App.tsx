import React from 'react';
import { Layout, Menu, Input, Icon } from 'antd';
import './App.less';
import createStore from './store';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import UserInfo from './features/user-info/UserInfo';

const store = createStore();

const { Header, Content, Footer, Sider } = Layout;
const { Search } = Input;

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
      <div className="App">
        <Layout className="layout">
          <Sider width={249} className="sider">
            <div className="sider-header">
              <img src="favicon466.ico" alt="Icon" className="icon-img" />
              <div className="title">
                <h2>Bullet Journal</h2>
              </div>
            </div>
            <Menu
              mode="inline"
              defaultSelectedKeys={['today']}
              style={{height: '100%', fontWeight: 500 }}
            >
              <Menu.Item key="today"><Icon type="carry-out" />Today</Menu.Item>
              <Menu.Item key="next7days"><Icon type="calendar" />Next 7 days</Menu.Item>
              <Menu.Item key="projects"><Icon type="folder" />Projects</Menu.Item>
              <Menu.Item key="groups"><Icon type="team" />Groups</Menu.Item>
              <Menu.Item key="labels"><Icon type="flag" />Labels</Menu.Item>
            </Menu>
          </Sider>
            <Layout style={{marginLeft : '250px'}}>
              <Header className="header">
                <div className="search-box">
                  <Search />
                </div>
                <UserInfo />
              </Header>
              <Content style={{ padding: '0 24px', minHeight: 280 }}>
                Content
              </Content>
              <ToastContainer />
              <Footer style={{ textAlign: 'center' }}>
                Bullet Journal ©2020 Created by{' '}
              </Footer>
            </Layout>
        </Layout>
      </div>
      </Provider>
    );
  }
}

export default App;
