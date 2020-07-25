import React, {useState} from 'react';
import {PlusOutlined, UserOutlined} from '@ant-design/icons';
import {
    Modal,
    Input,
    Button,
    Avatar,
    Empty,
    Tooltip,
    Form
} from 'antd';
import {connect} from 'react-redux';
import {addUserGroupByUsername} from '../../features/group/actions';
import {
    updateUser,
    clearUser,
    userApiErrorReceived
} from '../../features/user/actions';
import {UserWithAvatar} from '../../features/user/reducer';
import {IState} from '../../store';

import './modals.styles.less';

type ModalProps = {
    groupId: number;
    groupName: string;
    user: UserWithAvatar;
    addUserGroupByUsername: (
        groupId: number,
        username: string,
        groupName: string
    ) => void;
    updateUser: (username: string) => void;
    clearUser: () => void;
    userApiErrorReceived: (error: string) => void;
};

const AddUser: React.FC<ModalProps> = props => {
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const searchUser = (value: string) => {
        props.updateUser(value);
        props.clearUser();
    };

    const addUser = (groupId: number, username: string, groupName: string) => {
        props.addUserGroupByUsername(groupId, username, groupName);
        setVisible(false);
    };

    const onCancel = () => {
        props.clearUser();
        setVisible(false);
    };

    const {groupId, user, groupName} = props;
    return (
        <div className="group-footer">
            <Tooltip placement="top" title="Add User">
                <Button
                    type="primary"
                    icon={<PlusOutlined/>}
                    shape="round"
                    onClick={() => setVisible(true)}
                />
            </Tooltip>
            <Modal
                title="Add User"
                visible={visible}
                onCancel={onCancel}
                onOk={() => addUser(groupId, user.name, groupName)}
                okText="Add User"
                centered={true}
                width={300}
                okButtonProps={{disabled: !user.name}}
            >
                <Form form={form}>
                    <Form.Item name="username" rules={[{min: 1, required: true}]}>
                        <Input.Search
                            allowClear
                            prefix={<UserOutlined/>}
                            onSearch={() =>
                                form
                                    .validateFields()
                                    .then(values => {
                                        form.resetFields();
                                        searchUser(values.username);
                                    })
                                    .catch(info => console.log(info))
                            }
                            className="input-search-box"
                            placeholder="Enter Username"
                        />
                    </Form.Item>
                </Form>
                <div className="search-result">
                    {user.name ? (
                        <Avatar size="large" src={user.avatar}/>
                    ) : (
                        <Empty
                            description="No result found"
                            imageStyle={{height: '50px'}}
                        />
                    )}
                </div>
            </Modal>
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    user: state.user
});

export default connect(mapStateToProps, {
    addUserGroupByUsername,
    updateUser,
    clearUser,
    userApiErrorReceived
})(AddUser);
