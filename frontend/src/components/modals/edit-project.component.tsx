import React from 'react';
import { Modal, Input, Form, Select, Avatar, Tooltip } from 'antd';
import {
  EditOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { GroupsWithOwner } from '../../features/group/interface';
import { updateGroups } from '../../features/group/actions';
import { updateProject } from '../../features/project/actions';
import { IState } from '../../store';
import { Project } from '../../features/project/interface';
import { iconMapper } from '../../components/side-menu/side-menu.compoennt';

import './modals.styles.less';

const InputGroup = Input.Group;
const { TextArea } = Input;
const { Option } = Select;

type ProjectProps = {
  project: Project;
  updateProject: (
    projectId: number,
    description: string,
    groupId: number,
    name: string
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
};

class EditProject extends React.Component<
  ProjectProps & GroupProps,
  ModalState
> {
  componentDidMount() {
    this.props.updateGroups();
  }

  state: ModalState = {
    isShow: false,
    name: this.props.project.name,
    description: this.props.project.description,
    groupId:
      this.props.project && this.props.project.group
        ? this.props.project.group.id
        : 0
  };

  showModal = () => {
    const { name, description, group } = this.props.project;
    const groupId = group.id;
    this.setState({
      isShow: true,
      name: name,
      description: description,
      groupId: groupId
    });
  };

  updateProject = () => {
    this.setState({ isShow: false });
    const { id } = this.props.project;
    const { name, description, groupId } = this.state;
    this.props.updateProject(id, description, groupId, name);
  };

  onCancel = () => {
    this.setState({ isShow: false });
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
    const { project, groups: groupsByOwner } = this.props;
    return (
      <div className='edit-project' title='Edit Project'>
        <Tooltip placement='top' title='Edit Project'>
          <EditOutlined
            onClick={this.showModal}
            style={{ fontSize: 20 }}
          />
        </Tooltip>

        <Modal
          title='Edit BuJo'
          visible={this.state.isShow}
          onCancel={this.onCancel}
          onOk={this.updateProject}
        >
          <Form>
            <Form.Item>
              <InputGroup compact>
                <div style={{ alignItems: 'center', width: '100%' }}>
                  <span title={`${project.projectType}`}>
                    <strong>{iconMapper[project.projectType]}</strong>
                  </span>
                  <Input
                    style={{ width: '90%', marginLeft: '20px' }}
                    placeholder='Enter BuJo Name'
                    value={this.state.name}
                    onChange={e => this.onChangeName(e.target.value)}
                  />
                </div>

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
                  value={this.state.groupId}
                  onChange={value => this.onChangeGroupId(value)}
                >
                  {groupsByOwner.map(groupsOwner => {
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

export default connect(mapStateToProps, { updateGroups, updateProject })(
  EditProject
);
