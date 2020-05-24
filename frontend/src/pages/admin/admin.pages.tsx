import React, { useState } from 'react';

import './admin.styles.less';
import { Select, Button, Input } from 'antd';
import { setRole } from '../../features/admin/actions';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { Role } from '../../features/admin/interface';
const { Option } = Select;

type AdminProps = {
  setRole: (username: string, role: Role) => void;
};

const AdminPage: React.FC<AdminProps> = (props) => {
  const { setRole } = props;
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
          type='primary'
          onClick={() => {
            setRole(username, roleLevel);
          }}
        >
          set
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({});

export default connect(mapStateToProps, {
  setRole,
})(AdminPage);
