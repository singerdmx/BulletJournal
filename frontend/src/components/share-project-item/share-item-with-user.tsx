import React from 'react';
import { List, Button, Form, Input, Result, Avatar } from 'antd';
import { SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { shareTask } from '../../features/tasks/actions';
import { shareNote } from '../../features/notes/actions';
import {
  getProjectItemType,
  ProjectType,
} from '../../features/project/constants';
import { clearUser, updateUser } from '../../features/user/actions';
import { UserWithAvatar } from '../../features/user/reducer';
import './share-item-modal.styles.less';

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

const ShareProjectItemWithUser: React.FC<UserProps & ProjectItemProps> = (
  props
) => {
  const [form] = Form.useForm();
  const { user } = props;
  const searchUser = (value: string) => {
    props.updateUser(value);
    props.clearUser();
  };

  const shareProjectItemCall: { [key in ProjectType]: Function } = {
    [ProjectType.NOTE]: props.shareNote,
    [ProjectType.TODO]: props.shareTask,
    [ProjectType.LEDGER]: () => {},
  };

  const shareFunction = shareProjectItemCall[props.type];

  const shareProjectItem = (values: any) => {
    if (props.user.name) {
      shareFunction(props.projectItemId, false, props.user.name);
    }
  };

  return (
    <div>
      <Form form={form} layout="inline">
        <Form.Item name="username" rules={[{ min: 1, required: true }]}>
          <Input.Search
            allowClear
            style={{ width: '100%' }}
            prefix={<UserOutlined />}
            onSearch={() =>
              form
                .validateFields()
                .then((values) => {
                  console.log(values);
                  searchUser(values.username);
                })
                .catch((info) => console.log(info))
            }
            className="input-search-box"
            placeholder="Enter Username"
          />
        </Form.Item>
      </Form>
      <div className="share-info">
        {user.name ? (
          <List>
            <List.Item
              actions={[
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() =>
                    form
                      .validateFields()
                      .then((values) => {
                        shareProjectItem(values);
                      })
                      .catch((info) => console.log(info))
                  }
                >
                  Share
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={user.avatar} />}
                title={user.name}
              />
            </List.Item>
          </List>
        ) : (
          <Result
            icon={<SolutionOutlined />}
            title={`Share ${getProjectItemType(
              props.type
            ).toLocaleLowerCase()} with user`}
          />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  user: state.user,
});

export default connect(mapStateToProps, {
  shareTask,
  shareNote,
  updateUser,
  clearUser,
})(ShareProjectItemWithUser);
