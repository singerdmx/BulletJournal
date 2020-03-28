import React, {useEffect, useState} from 'react';
import {Avatar, Form, Modal, Select, Tabs} from 'antd';
import {ShareAltOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {GroupsWithOwner} from '../../features/group/interface';
import {updateGroups} from '../../features/group/actions';
import {IState} from '../../store';
import {shareTask} from '../../features/tasks/actions';
import {shareNote} from '../../features/notes/actions';
import {shareTransaction} from '../../features/transactions/actions';
import './modals.styles.less';

const {TabPane} = Tabs;
const {Option} = Select;

type ProjectItemProps = {
  type: string;
  projectItemId: number;
  shareTask: (taskId: number, targetUser: string, targetGroup: number, generateLink: boolean) => void;
  shareNote: (noteId: number, targetUser: string, targetGroup: number, generateLink: boolean) => void;
  shareTransaction: (transactionId: number, targetUser: string, targetGroup: number, generateLink: boolean) => void;
};

//props of groups
type GroupProps = {
  groups: GroupsWithOwner[];
  updateGroups: () => void;
};

const ShareProjectItem: React.FC<GroupProps & ProjectItemProps> = props => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

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
      case 'NOTE':
        // props.moveNote(props.projectItemId, projectId, history);
        break;
      case 'TASK':
        // props.moveTask(props.projectItemId, projectId, history);
        break;
      case 'TRANSACTION':
        // props.moveTransaction(props.projectItemId, projectId, history);
        break;
    }
    setVisible(false);
  };

  const shareWithGroup = () => {
    const {groups: groupsWithOwner} = props;
    if (groupsWithOwner.length === 0) {
      return null;
    }

    return <div>
      <Form.Item name="group">
        <Select
            placeholder="Choose Group"
            style={{width: '100%'}}
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
                      <Avatar size="small" src={group.ownerAvatar}/>
                      &nbsp;&nbsp;
                      <strong> {group.name} </strong> (owner <strong>{group.owner}</strong>)
                    </Option>
                ));
              }
          )}
        </Select>
      </Form.Item>
    </div>;
  };

  const getModal = () => {
    return (
        <Modal
            title={`SHARE ${props.type}`}
            destroyOnClose
            centered
            okText="Confirm"
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
            <Form form={form} labelAlign="left">
              <Tabs defaultActiveKey="Group" tabPosition={"left"}>
                <TabPane tab='Group' key='Group'>
                  {shareWithGroup()}
                </TabPane>
                <TabPane tab='User' key='User'>
                </TabPane>
                <TabPane tab='Link' key='Link'>
                </TabPane>
              </Tabs>
            </Form>
          </div>
        </Modal>
    );
  };

  const getDiv = () => {
    return (
        <div onClick={openModal} style={{cursor: 'pointer'}}>
          <span>Share</span>
          <ShareAltOutlined/>
          {getModal()}
        </div>
    );
  };

  return getDiv();
};

const mapStateToProps = (state: IState) => ({
  groups: state.group.groups,
});

export default connect(mapStateToProps, {
  updateGroups,
  shareTask,
  shareNote,
  shareTransaction
})(ShareProjectItem);
