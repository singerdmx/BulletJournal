import React from 'react';
import { Modal, Input, Form, Button, Select, Avatar } from 'antd';
import {
  FolderAddOutlined,
  CarryOutOutlined,
  FileTextOutlined,
  AccountBookOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { GroupsWithOwner } from '../../features/group/interfaces';
import { createProjectByName } from '../../features/project/actions';
import { updateGroups } from '../../features/group/actions';
import { ProjectType, toProjectType } from '../../features/project/constants';
import { IState } from '../../store';

import './modals.styles.less';

const InputGroup = Input.Group;
const { TextArea } = Input;
const { Option } = Select;

type ProjectProps = {
  createProjectByName: (
    description: string,
    groupId: number,
    name: string,
    projectType: ProjectType
  ) => void;
};

//props of groups
type GroupProps = {
  groups: GroupsWithOwner[];
  updateGroups: () => void;
};

type ModalState = {
  isShow: boolean;
  name: string;
  description: string;
  groupId: number;
  projectType: string;
};

class AddProject extends React.Component<
  ProjectProps & GroupProps,
  ModalState
> {
  componentDidMount() {
    this.props.updateGroups();
  }

  state: ModalState = {
    isShow: false,
    name: '',
    description: '',
    groupId: -1,
    projectType: ''
  };

  showModal = () => {
    this.setState({ isShow: true });
  };

  addProject = () => {
    const { description, groupId, name, projectType } = this.state;
    let type: ProjectType = toProjectType(projectType);
    this.props.createProjectByName(description, groupId, name, type);
    this.setState({
      isShow: false,
      name: '',
      description: '',
      groupId: -1,
      projectType: ''
    });
  };

  onCancel = () => {
    this.setState({ isShow: false });
  };

  onChangeProjectType = (projectType: string) => {
    this.setState({ projectType: projectType });
  };

  onChangeName = (name: string) => {
    this.setState({ name: name });
  };

  onChangeDescription = (description: string) => {
    this.setState({ description: description });
  };

  onChangeGroupId = (groupId: number) => {
    this.setState({ groupId: groupId });
  };

  render() {
    const { groups: groupsByOwner } = this.props;
    return (
      <div className='add-project menu' title='Create New BuJo'>
        <Button onClick={this.showModal} type='dashed' block>
          <FolderAddOutlined style={{ fontSize: 20 }} />
        </Button>
        <Modal
          title='Create New BuJo'
          visible={this.state.isShow}
          onCancel={this.onCancel}
          onOk={this.addProject}
        >
          <Form>
            <Form.Item>
              <InputGroup compact>
                <Select
                  style={{ width: '40%' }}
                  placeholder='Choose Project Type'
                  value={
                    this.state.projectType ? this.state.projectType : undefined
                  }
                  onChange={e => this.onChangeProjectType(e)}
                >
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
                <Input
                  style={{ width: '60%' }}
                  placeholder='Enter BuJo Name'
                  value={this.state.name}
                  onChange={e => this.onChangeName(e.target.value)}
                />
                <div style={{ margin: '24px 0' }} />
                <TextArea
                  placeholder='Enter Description'
                  autoSize
                  value={this.state.description}
                  onChange={e => this.onChangeDescription(e.target.value)}
                />
                <div style={{ margin: '24px 0' }} />
                <Select
                  placeholder='Choose Group'
                  style={{ width: '100%' }}
                  value={
                    this.state.groupId < 0 ? undefined : this.state.groupId
                  }
                  onChange={e => this.onChangeGroupId(e)}
                >
                  {groupsByOwner.map((groupsOwner, index) => {
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
  groups: state.group.groups
});

export default connect(mapStateToProps, { updateGroups, createProjectByName })(
  AddProject
);
