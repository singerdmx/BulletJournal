import React, { useState, useEffect } from 'react';

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
  Tabs,
  Descriptions,
  InputNumber,
} from 'antd';
import {
  getUsersByRole,
  setRole,
  getLockedUsersAndIPs,
  unlockUserandIP,
  lockUserandIP,
  getUserInfo,
  changePoints,
  //setPoints,
} from '../../features/admin/actions';
import { IState } from '../../store';
import { connect } from 'react-redux';
import {
  Role,
  LockedUser,
  LockedIP,
  UserInfo,
} from '../../features/admin/interface';
import { User } from '../../features/group/interface';
import {
  DeleteOutlined,
  FormOutlined,
  CloseCircleOutlined, DatabaseOutlined,
} from '@ant-design/icons';
import {Button as FloatButton, Container, darkColors, lightColors} from "react-floating-action-button";
import {useHistory} from "react-router-dom";
import {CopyrightOutlined, FundViewOutlined} from "@ant-design/icons/lib";

const { Panel } = Collapse;
const { Option } = Select;
const { TabPane } = Tabs;

type AdminProps = {
  userInfo: UserInfo;
  usersByRole: User[];
  lockedUsers: LockedUser[];
  lockedIPs: LockedIP[];
  getUserInfo: (username: string) => void;
  setRole: (username: string, role: Role) => void;
  //setPoints: (username: string, points: number) => void;
  changePoints: (username: string, points: number, description: string) => void;
  getUsersByRole: (role: Role) => void;
  getLockedUsersAndIPs: () => void;
  unlockUserandIP: (name: string, ip: string) => void;
  lockUserandIP: (name: string, ip: string, reason: string) => void;
};

const AdminPage: React.FC<AdminProps> = (props) => {
  const history = useHistory();
  const {
    setRole,
    getUserInfo,
    userInfo,
    lockedUsers,
    lockedIPs,
    usersByRole,
    getUsersByRole,
    getLockedUsersAndIPs,
    unlockUserandIP,
    lockUserandIP,
    changePoints
   //setPoints,
  } = props;
  const [username, setUsername] = useState('');
  const [roleLevel, setRoleLevel] = useState('BASIC' as Role);
  const [searchName, changePointsName] = useState('');
  const [inputPoints, setInputPoints] = useState(0);
  const [lockName, setLockName] = useState('');
  const [lockIP, setLockIP] = useState('');
  const [lockReason, setLockReason] = useState('');
  const [description, setDescription] = useState('');
  const [mode, setMode] = useState('display');
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
      title: '',
      dataIndex: '',
      key: '',
      render: (a: any) => (
        <Tooltip placement='left' title='Unblock User'>
          <DeleteOutlined
            onClick={() => {
              unlockUserandIP(a.name, '');
            }}
          />
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
      title: '',
      dataIndex: '',
      key: '',
      render: (a: any) => (
        <Tooltip placement='left' title='Unblock User'>
          <DeleteOutlined
            onClick={() => {
              unlockUserandIP('', a.ip);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  useEffect(() => {
    setInputPoints(userInfo.points);
  }, [userInfo.points]);

  useEffect(() => {
    document.title = 'Bullet Journal - Admins';
  }, []);

  const handleLockUsers = () => {
    lockUserandIP(lockName, lockIP, lockReason);
    setLockIP('');
    setLockName('');
    setLockReason('');
  };

  const handleChangeMode = () => {
    if (mode === 'edit') {
      setMode('display');
      setInputPoints(userInfo.points);
    } else {
      setMode('edit');
    }
  };

  return (
    <div className='admin-page'>
      <Container>
        <FloatButton
            tooltip="Metadata"
            onClick={() => history.push(`/admin/metadata`)}
            styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
        >
          <DatabaseOutlined />
        </FloatButton>
        <FloatButton
            tooltip="Categories"
            onClick={() => history.push(`/admin/categories`)}
            styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
        >
          <CopyrightOutlined />
        </FloatButton>
        <FloatButton
            tooltip="Workflow"
            onClick={() => history.push(`/admin/workflow`)}
            styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
        >
          <FundViewOutlined />
        </FloatButton>
      </Container>
      <Collapse defaultActiveKey={['userRoles', 'lockUsers', 'userInfo']}>
        <Panel header='User Info' key='userInfo'>
          <div className='admin-row'>
            <Input
              style={{ width: '150px', marginRight: '20px' }}
              placeholder='Username'
              value={searchName}
              onChange={(e) => {
                changePointsName(e.target.value);
              }}
            />
            <Button
              type='primary'
              onClick={() => {
                if (!searchName) return;
                getUserInfo(searchName);
              }}
            >
              Get User Info
            </Button>
          </div>
          {userInfo.id && (
            <div>
              <Descriptions
                title={
                  <div>
                    User Info&nbsp;&nbsp;
                    {mode === 'edit' ? (
                      <Tooltip title='Cancel'>
                        <CloseCircleOutlined onClick={handleChangeMode} />
                      </Tooltip>
                    ) : (
                      <Tooltip title='Edit'>
                        <FormOutlined onClick={handleChangeMode} />
                      </Tooltip>
                    )}
                    <Button
                      style={{ marginLeft: '340px' }}
                      type='primary'
                      onClick={() => {
                        changePoints(searchName, inputPoints, description);
                        setMode('display');
                      }}
                    >
                      Update
                    </Button>
                  </div>
                }
                bordered
                size='small'
                column={2}
              >
                <Descriptions.Item label='Id'>{userInfo.id}</Descriptions.Item>
                <Descriptions.Item label='Name'>
                  {userInfo.name}
                </Descriptions.Item>
                <Descriptions.Item label='TimeZone' span={2}>
                  {userInfo.timezone}
                </Descriptions.Item>
                <Descriptions.Item label='Currency'>
                  {userInfo.currency}
                </Descriptions.Item>
                <Descriptions.Item label='Theme'>
                  {userInfo.theme}
                </Descriptions.Item>
                <Descriptions.Item label='Points'>
                  {userInfo.points}
                </Descriptions.Item>
                <Descriptions.Item label='AddOrDeletePoints'>
                  {mode === 'display' && 0}
                  {mode === 'edit' && (
                    <InputNumber
                      style={{ width: '70px' }}
                      placeholder='AddOrDeletePoints'
                      onChange={(value) => {
                        if (!value || isNaN(value)) setInputPoints(0);
                        else setInputPoints(value);
                      }}
                    />
                  )}
                </Descriptions.Item>
                <Descriptions.Item label='Description'>
                  {mode === 'display' && ''}
                  {mode === 'edit' && (
                  <Input
                      placeholder='Description'
                      style={{ width: '500px' }}
                      onChange={(e: any) => {
                        setDescription(e.target.value);
                      }}
                  />
                  )}
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </Panel>
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
          <div className='lock-user-row'>
            <Input
              disabled={lockIP.length > 0}
              style={{ width: '170px' }}
              value={lockName}
              placeholder='Username'
              onChange={(e: any) => {
                setLockName(e.target.value);
              }}
            />
            &nbsp;&nbsp;&nbsp;OR&nbsp;&nbsp;&nbsp;
            <Input
              disabled={lockName.length > 0}
              style={{ width: '170px' }}
              value={lockIP}
              placeholder='IP'
              onChange={(e: any) => {
                setLockIP(e.target.value);
              }}
            />
            <Button
              type='primary'
              onClick={handleLockUsers}
              style={{ marginLeft: '20px' }}
            >
              Lock User
            </Button>
          </div>
          <div className='lock-user-row'>
            <Input
              placeholder='Reason'
              style={{ width: '500px' }}
              value={lockReason}
              onChange={(e: any) => {
                setLockReason(e.target.value);
              }}
            />
          </div>
          <div className='lock-user-row'>
            <Button type='primary' onClick={getLockedUsersAndIPs}>
              Get Locked Users
            </Button>
          </div>
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
  userInfo: state.admin.userInfo,
});

export default connect(mapStateToProps, {
  setRole,
  getUsersByRole,
  getLockedUsersAndIPs,
  unlockUserandIP,
  lockUserandIP,
  getUserInfo,
  changePoints
  //setPoints,
})(AdminPage);
