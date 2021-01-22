import React from 'react';
import { List, Form, Input, Result, Avatar, Tooltip } from 'antd';
import { SolutionOutlined, UserOutlined, SendOutlined, ShareAltOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { shareTask, shareTaskByEmail } from '../../features/tasks/actions';
import { shareNote, shareNoteByEmail } from '../../features/notes/actions';
import { shareTransactionByEmail } from '../../features/transactions/actions';
import {
  getProjectItemType,
  ProjectType,
} from '../../features/project/constants';
import { clearUser, updateUser } from '../../features/user/actions';
import { UserWithAvatar } from '../../features/user/reducer';
import './share-item-modal.styles.less';
import { Content } from '../../features/myBuJo/interface';

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
  shareNoteByEmail: (
    noteId: number,
    contents: Content[],
    emails: string[],
    targetUser?: string,
    targetGroup?: number,
  ) => void;
  shareTaskByEmail: (
    taskId: number,
    contents: Content[],
    emails: string[],
    targetUser?: string,
    targetGroup?: number,
  ) => void;
  shareTransactionByEmail: (
    transactionId: number,
    contents: Content[],
    emails: string[],
    targetUser?: string,
    targetGroup?: number,
  ) => void;
  noteContents: Content[];
  taskContents: Content[];
  transactionContents: Content[];
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
  const { user, type } = props;
  const searchUser = (value: string) => {
    props.updateUser(value);
    props.clearUser();
  };

  const shareProjectItemCall: { [key in ProjectType]: Function } = {
    [ProjectType.NOTE]: props.shareNote,
    [ProjectType.TODO]: props.shareTask,
    [ProjectType.LEDGER]: () => {},
  };

  const shareProjectItemByEmailCall: { [key in ProjectType]: Function } = {
    [ProjectType.NOTE]: props.shareNoteByEmail,
    [ProjectType.TODO]: props.shareTaskByEmail,
    [ProjectType.LEDGER]: props.shareTransactionByEmail,
  };

  const contents : { [key in ProjectType ] : Content[] } = {
    [ProjectType.NOTE]: props.noteContents,
    [ProjectType.TODO]: props.taskContents,
    [ProjectType.LEDGER]: props.transactionContents,
  }

  const shareFunction = shareProjectItemCall[props.type];
  const shareByEmailFunction = shareProjectItemByEmailCall[props.type];

  const shareProjectItem = (values: any) => {
    if (props.user.name) {
      shareFunction(props.projectItemId, false, props.user.name);
    }
  };

  const shareProjectItemByEmail = (values: any) => {
    if (props.user.name) {
      shareByEmailFunction(props.projectItemId, contents[props.type], [], props.user.name);
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
                type === ProjectType.LEDGER ? null : 
                <Tooltip title='Share'>
                  <ShareAltOutlined 
                    style={{
                      marginRight: '16px', 
                      color: '#00cae9', 
                      fontSize: '20px'}}
                    onClick={() =>
                      form
                        .validateFields()
                        .then((values) => {
                          shareProjectItem(values);
                        })
                        .catch((info) => console.log(info))
                    }
                  />
                </Tooltip>,
                <Tooltip title='Send email'>
                    <SendOutlined 
                    onClick={()=> {
                      form
                        .validateFields()
                        .then((values) => {
                          shareProjectItemByEmail(values);
                        })
                        .catch((info) => console.log(info))
                    }} 
                    style={{color: '#00cae9', fontSize: '20px'}} />
                </Tooltip>
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
  noteContents: state.note.contents,
  taskContents: state.task.contents,
  transactionContents: state.transaction.contents,
});

export default connect(mapStateToProps, {
  shareTask,
  shareNote,
  updateUser,
  clearUser,
  shareNoteByEmail,
  shareTaskByEmail,
  shareTransactionByEmail,
})(ShareProjectItemWithUser);
