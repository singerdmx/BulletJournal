import React from 'react';
import { Modal, Input, Form, Select, Avatar } from 'antd';
import {
  EditOutlined,
  CarryOutOutlined,
  FileTextOutlined,
  AccountBookOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { GroupsWithOwner } from '../../features/group/interfaces';
import { updateGroups } from '../../features/group/actions';
import { IState } from '../../store';

import './modals.styles.less';

const InputGroup = Input.Group;
const { TextArea } = Input;
const { Option } = Select;

type ProjectProps = {};

//props of groups
type GroupProps = {
  groups: GroupsWithOwner[];
  updateGroups: () => void;
};

type ModalState = {
  isShow: boolean;
};

class EditProject extends React.Component<
  ProjectProps & GroupProps,
  ModalState
> {
  componentDidMount() {
    this.props.updateGroups();
  }

  state: ModalState = {
    isShow: false
  };

  showModal = () => {
    this.setState({ isShow: true });
  };

  updateProject = () => {
    this.setState({ isShow: false });
  };

  onCancel = () => {
    this.setState({ isShow: false });
  };

  render() {
    const { groups: groupsByOwner } = this.props;
    return (
      <div className='edit-project' title='Edit Project'>
        <EditOutlined
          title='Edit Project'
          onClick={this.showModal}
          style={{ fontSize: 20 }}
        />

        <Modal
          title='Edit BuJo'
          visible={this.state.isShow}
          onCancel={this.onCancel}
          onOk={() => this.updateProject}
        >
          <Form>
            <Form.Item>
              <InputGroup compact>
                <Select placeholder='Choose Project Type'>
                  <Option value='TODO' title='Project Type: TODO'>
                    <CarryOutOutlined />
                    &nbsp;TODO
                  </Option>
                  <Option value='NOTE' title='Project Type: NOTE'>
                    <FileTextOutlined />
                    &nbsp;NOTE
                  </Option>
                  <Option value='LEDGER' title='Project Type: LEDGER'>
                    <AccountBookOutlined />
                    &nbsp;LEDGER
                  </Option>
                </Select>
                <Input style={{ width: '60%' }} placeholder='Enter BuJo Name' />
                <div style={{ margin: '24px 0' }} />
                <TextArea placeholder='Enter Description' autoSize />
                <div style={{ margin: '24px 0' }} />
                <Select placeholder='Choose Group' style={{ width: '100%' }}>
                  {groupsByOwner.map((groupsOwner) => {
                    return groupsOwner.groups.map(group => (
                      <Option
                        key={`group${group.id}`}
                        value={group.id}
                        title={`Group "${group.name}" (owner "${group.owner}")`}
                      >
                        <Avatar size='small' src={group.ownerAvatar} />
                        &nbsp;&nbsp;Group <strong>
                          {group.name}
                        </strong> (owner <strong>{group.owner}</strong>)
                      </Option>
                    ));
                  })}
                </Select>
              </InputGroup>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  groups: state.group.groups
});

export default connect(mapStateToProps, { updateGroups })(EditProject);
