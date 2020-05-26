import React, { useState } from 'react';

import './admin.styles.less';
import { Select, Button, Input, Avatar } from 'antd';
import { setRole, getUsersByRole } from '../../features/admin/actions';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { Role } from '../../features/admin/interface';
import { User } from '../../features/group/interface';
const { Option } = Select;

type AdminProps = {
  userRoles: User[];
  setRole: (username: string, role: Role) => void;
  getUsersByRole: (role: Role) => void;
};

const AdminPage: React.FC<AdminProps> = (props) => {
  const { setRole, userRoles, getUsersByRole } = props;
  const [username, setUsername] = useState('');
  const [roleLevel, setRoleLevel] = useState('BASIC' as Role);

  return (
    <div className='admin-page'>
      <div>
        <Input
          style={{ width: '100px' }}
          value={username}
          onChange={(e: any) => {
            setUsername(e.target.value);
          }}
        />
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
      </div>
      <div>
        <Button
          className='button'
          type='primary'
          onClick={() => {
            setRole(username, roleLevel);
          }}
        >
          set
        </Button>
        <Button
          className='button'
          type='primary'
          onClick={() => {
            getUsersByRole(roleLevel);
          }}
        >
          get
        </Button>
      </div>
      {userRoles && userRoles.length > 0 && (
        <div>
          <div>All users with selected Role</div>
          {userRoles.map((u) => {
            return (
              <div style={{ marginBottom: '20px' }}>
                <Avatar src={u.avatar} />
                &nbsp;&nbsp;
                {u.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  userRoles: state.admin.userRoles,
});

export default connect(mapStateToProps, {
  setRole,
  getUsersByRole,
})(AdminPage);
