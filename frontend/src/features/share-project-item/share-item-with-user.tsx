import React from 'react';
import {Avatar, Form, Input, Result} from 'antd';
import {UserOutlined, SolutionOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {IState} from '../../store';
import {shareTask} from '../../features/tasks/actions';
import {shareNote} from '../../features/notes/actions';
import {getProjectItemType, ProjectType} from "../../features/project/constants";
import {clearUser, updateUser} from "../user/actions";
import {UserWithAvatar} from "../user/reducer";

type ProjectItemProps = {
    type: ProjectType;
    projectItemId: number;
    shareTask: (
        taskId: number,
        generateLink: boolean,
        targetUser?: string,
        targetGroup?: number,
        ttl?: number
    ) => void;
    shareNote: (
        noteId: number,
        generateLink: boolean,
        targetUser?: string,
        targetGroup?: number,
        ttl?: number
    ) => void;
};

// props of user
type UserProps = {
    user: UserWithAvatar;
    updateUser: (username: string) => void;
    clearUser: () => void;
};

const ShareProjectItemWithUser: React.FC<UserProps & ProjectItemProps> = props => {
    const [form] = Form.useForm();
    const {user} = props;
    const searchUser = (value: string) => {
        props.updateUser(value);
        props.clearUser();
    };

    const shareProjectItem = (values: any) => {
        switch (props.type) {
            case ProjectType.NOTE:
                // props.moveNote(props.projectItemId, projectId, history);
                break;
            case ProjectType.TODO:
                // props.moveTask(props.projectItemId, projectId, history);
                break;
            case ProjectType.LEDGER:
                // props.moveTransaction(props.projectItemId, projectId, history);
                break;
        }
    };

    return <div>
        <Form form={form}>
            <Form.Item name='user'>
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
            className='input-search-box'
            placeholder='Enter Username'
        />
                <div className='search-result'>
                    {user.name ? <Avatar size='large' src={user.avatar}/> : null}
                </div>
                <Result
                    icon={<SolutionOutlined/>}
                    title={`Share ${getProjectItemType(props.type)} with USER`}
                />
            </Form.Item>
        </Form>
    </div>
};

const mapStateToProps = (state: IState) => ({
    user: state.user
});

export default connect(mapStateToProps, {
    shareTask,
    shareNote,
    updateUser,
    clearUser
})(ShareProjectItemWithUser);
