import React, {useEffect, useState} from 'react';
import {Avatar, Form, Input, Modal, Result, Select, Tabs, Tooltip} from 'antd';
import {LinkOutlined, ShareAltOutlined, SolutionOutlined, TeamOutlined, UserOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {GroupsWithOwner} from '../../features/group/interface';
import {updateGroups} from '../../features/group/actions';
import {IState} from '../../store';
import {shareTask} from '../../features/tasks/actions';
import {shareNote} from '../../features/notes/actions';
import {shareTransaction} from '../../features/transactions/actions';
import './modals.styles.less';
import {clearUser, updateUser} from '../../features/user/actions';
import {UserWithAvatar} from '../../features/user/reducer';
import {getProjectItemType, ProjectType} from "../../features/project/constants";

const { TabPane } = Tabs;
const { Option } = Select;

type ProjectItemProps = {
  mode: string;
  type: ProjectType;
  projectItemId: number;
  user: UserWithAvatar;
  shareTask: (
    taskId: number,
    targetUser: string,
    targetGroup: number,
    generateLink: boolean
  ) => void;
  shareNote: (
    noteId: number,
    targetUser: string,
    targetGroup: number,
    generateLink: boolean
  ) => void;
  shareTransaction: (
    transactionId: number,
    targetUser: string,
    targetGroup: number,
    generateLink: boolean
  ) => void;
};

//props of groups
type GroupProps = {
  groups: GroupsWithOwner[];
  updateGroups: () => void;
  updateUser: (username: string) => void;
  clearUser: () => void;
};

const ShareProjectItem: React.FC<GroupProps & ProjectItemProps> = props => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const { mode } = props;

  const searchUser = (value: string) => {
    props.updateUser(value);
    props.clearUser();
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setVisible(false);
  };

  const openModal = () => {
    setVisible(true);
  };

  useEffect(() => {
    props.updateGroups();
  }, []);

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
    setVisible(false);
  };

  const shareWithGroup = () => {
    const { groups: groupsWithOwner } = props;
    if (groupsWithOwner.length === 0) {
      return null;
    }

    return (
      <div>
        <Form.Item name='group'>
          <Select
            placeholder='Choose Group'
            style={{ width: '100%' }}
            defaultValue={groupsWithOwner[0].groups[0].id}
          >
            {groupsWithOwner.map(
              (groupsOwner: GroupsWithOwner, index: number) => {
                return groupsOwner.groups.map(group => (
                  <Option
                    key={`group${group.id}`}
                    value={group.id}
                    title={`Group "${group.name}" (owner "${group.owner}")`}
                  >
                    <Avatar size='small' src={group.ownerAvatar} />
                    &nbsp;&nbsp;
                    <strong> {group.name} </strong> (owner{' '}
                    <strong>{group.owner}</strong>)
                  </Option>
                ));
              }
            )}
          </Select>
        </Form.Item>
      </div>
    );
  };

  const getModal = () => {
    const { user } = props;
    return (
      <Modal
        title={`SHARE ${getProjectItemType(props.type)}`}
        destroyOnClose
        centered
        okText='Confirm'
        visible={visible}
        onCancel={e => handleCancel(e)}
        onOk={() => {
          form
            .validateFields()
            .then(values => {
              form.resetFields();
              shareProjectItem(values);
            })
            .catch(info => console.log(info));
        }}
      >
        <div>
          <Form form={form} labelAlign='left'>
            <Tabs defaultActiveKey='Group' tabPosition={'left'}>
              <TabPane tab='Group' key='Group'>
                {shareWithGroup()}
                <Result
                  icon={<TeamOutlined />}
                  title={`Share ${getProjectItemType(props.type)} with GROUP`}
                />
              </TabPane>
              <TabPane tab='User' key='User'>
                <Form.Item name='username'>
                  <Input.Search
                    allowClear
                    prefix={<UserOutlined />}
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
                </Form.Item>
                <div className='search-result'>
                  {user.name ? <Avatar size='large' src={user.avatar} /> : null}
                </div>
                <Result
                  icon={<SolutionOutlined />}
                  title={`Share ${getProjectItemType(props.type)} with USER`}
                />
              </TabPane>
              <TabPane tab='Link' key='Link'>
                <Result
                  icon={<LinkOutlined />}
                  title={`Generate Shareable LINK`}
                />
              </TabPane>
              <TabPane tab='Manage' key='Manage'>
                <Result
                    icon={<LinkOutlined />}
                    title={`Manage Shared ${getProjectItemType(props.type)}`}
                />
              </TabPane>
            </Tabs>
          </Form>
        </div>
      </Modal>
    );
  };

  const getDiv = () => {
    if (mode === 'div') {
      return (
        <div onClick={openModal} className='popover-control-item'>
          <span>Share</span>
          <ShareAltOutlined />
          {getModal()}
        </div>
      );
    } else {
      return (
          <Tooltip title={`SHARE ${getProjectItemType(props.type)}`}>
            <div style={{ cursor: 'pointer' }}>
              <span onClick={openModal}>
                <ShareAltOutlined />
                {getModal()}
              </span>
            </div>
          </Tooltip>
      );
    }
  };

  return getDiv();
};

const mapStateToProps = (state: IState) => ({
  groups: state.group.groups,
  user: state.user
});

export default connect(mapStateToProps, {
  updateGroups,
  shareTask,
  shareNote,
  shareTransaction,
  updateUser,
  clearUser
})(ShareProjectItem);
