import React, {useState} from 'react';

import './admin.styles.less';
import {Avatar, Button, Collapse, Empty, Input, Select, Tooltip} from 'antd';
import {getUsersByRole, setRole} from '../../features/admin/actions';
import {IState} from '../../store';
import {connect} from 'react-redux';
import {Role} from '../../features/admin/interface';
import {User} from '../../features/group/interface';

const {Panel} = Collapse;
const {Option} = Select;

type AdminProps = {
    usersByRole: User[];
    setRole: (username: string, role: Role) => void;
    getUsersByRole: (role: Role) => void;
};

const AdminPage: React.FC<AdminProps> = (props) => {
    const {setRole, usersByRole, getUsersByRole} = props;
    const [username, setUsername] = useState('');
    const [roleLevel, setRoleLevel] = useState('BASIC' as Role);

    return (
        <div className='admin-page'>
            <Collapse defaultActiveKey={['userRoles', 'lockUsers']}>
                <Panel header="User Roles" key="userRoles">
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
                            style={{width: '180px'}}
                            value={username}
                            placeholder='Username'
                            onChange={(e: any) => {
                                setUsername(e.target.value);
                            }}
                        />
                        {' '}
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
                    {usersByRole && usersByRole.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/> : (
                        <div className='users-with-role'>
                            {usersByRole.map((u) => {
                                return (
                                    <span style={{marginBottom: '20px'}} key={u.name}>
                                <Avatar src={u.avatar}/>
                                        &nbsp;&nbsp;
                                        {u.name}
                            </span>
                                );
                            })}
                        </div>
                    )}
                </Panel>
                <Panel header="Lock Users" key="lockUsers">
                </Panel>
            </Collapse>
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    usersByRole: state.admin.usersByRole,
});

export default connect(mapStateToProps, {
    setRole,
    getUsersByRole,
})(AdminPage);
