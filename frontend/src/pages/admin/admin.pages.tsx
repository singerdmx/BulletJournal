import React, { useState } from 'react';

import './admin.styles.less';
import {
  Avatar,
  Button,
  Collapse,
  Empty,
  Input,
  Select,
  Tooltip,
  Table,
  Form,
  Tabs,
} from 'antd';
import {
  getUsersByRole,
  setRole,
  getBlockedUsersAndIPs,
} from '../../features/admin/actions';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { Role, LockedUser, LockedIP } from '../../features/admin/interface';
import { User } from '../../features/group/interface';
import { DeleteOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Option } = Select;
const { TabPane } = Tabs;

type AdminProps = {
  usersByRole: User[];
  lockedUsers: LockedUser[];
  lockedIPs: LockedIP[];
  setRole: (username: string, role: Role) => void;
  getUsersByRole: (role: Role) => void;
  getBlockedUsersAndIPs: () => void;
};

const AdminPage: React.FC<AdminProps> = (props) => {
  const {
    setRole,
    lockedUsers,
    lockedIPs,
    usersByRole,
    getUsersByRole,
    getBlockedUsersAndIPs,
  } = props;
  const [username, setUsername] = useState('');
  const [roleLevel, setRoleLevel] = useState('BASIC' as Role);
  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Expire Time (Hours)',
      dataIndex: 'expirationInHour',
      key: 'expirationInHour',
    },
    {
      title: 'Remove',
      dataIndex: 'remove',
      key: 'remove',
      render: (a: any) => (
        <Tooltip placement='left' title='Unblock User'>
          <DeleteOutlined />
        </Tooltip>
      ),
    },
  ];
  const IPcolumns = [
    {
      title: 'IP',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Expire Time (Hours)',
      dataIndex: 'expirationInHour',
      key: 'expirationInHour',
    },
    {
      title: 'Remove',
      dataIndex: '',
      key: '',
      render: (a: any) => (
        <Tooltip placement='left' title='Unblock User'>
          <DeleteOutlined />
        </Tooltip>
      ),
    },
  ];

  return (
    <div className='admin-page'>
      <Collapse defaultActiveKey={['userRoles', 'lockUsers']}>
        <Panel header='User Roles' key='userRoles'>
          <div className='user-role-control'>
            <Tooltip title='Select Role'>
              <span>
                <Select
                  className='role-dropdown'
                  value={roleLevel}
                  onChange={(v) => {
                    setRoleLevel(v as Role);
                  }}
                >
                  {Object.values(Role).map((r: string) => {
                    return (
                      <Option value={r} key={r}>
                        {r}
                      </Option>
                    );
                  })}
                </Select>
              </span>
            </Tooltip>
            <Input
              allowClear={true}
              style={{ width: '120px' }}
              value={username}
              placeholder='Username'
              onChange={(e: any) => {
                setUsername(e.target.value);
              }}
            />
            <Button
              className='button'
              type='primary'
              onClick={() => {
                setRole(username, roleLevel);
              }}
            >
              Set Role
            </Button>
            <Button
              className='button'
              type='primary'
              onClick={() => {
                getUsersByRole(roleLevel);
              }}
            >
              Get Users by Role
            </Button>
          </div>
          {usersByRole && usersByRole.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <div className='users-with-role'>
              {usersByRole.map((u) => {
                return (
                  <span style={{ marginBottom: '20px' }} key={u.name}>
                    <Avatar src={u.avatar} />
                    &nbsp;&nbsp;
                    {u.name}
                  </span>
                );
              })}
            </div>
          )}
        </Panel>
        <Panel header='Lock Users' key='lockUsers'>
          <Button type='primary' onClick={getBlockedUsersAndIPs}>
            Get Blocked Users
          </Button>
          <Tabs defaultActiveKey={'user'}>
            <TabPane tab={<span>Users</span>} key='users'>
              <Table columns={columns} dataSource={lockedUsers} />
            </TabPane>
            <TabPane tab={<span>IPs</span>} key='ips'>
              <Table columns={IPcolumns} dataSource={lockedIPs} />
            </TabPane>
          </Tabs>
        </Panel>
      </Collapse>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  usersByRole: state.admin.usersByRole,
  lockedUsers: state.admin.lockedUsers,
  lockedIPs: state.admin.lockedIPs,
});

export default connect(mapStateToProps, {
  setRole,
  getUsersByRole,
  getBlockedUsersAndIPs,
})(AdminPage);
