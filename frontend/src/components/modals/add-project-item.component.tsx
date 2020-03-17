import React from 'react';
import { Modal, Button, Tooltip, Select } from 'antd';
import {
  PlusOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { GroupsWithOwner } from '../../features/group/interface';
import { createProjectByName } from '../../features/project/actions';
import { updateGroups } from '../../features/group/actions';
import { IState } from '../../store';
import { Project, ProjectsWithOwner } from '../../features/project/interface';

import './modals.styles.less';
import {flattenOwnedProject, flattenSharedProject} from "../../pages/projects.pages";

const { Option } = Select;

type ProjectItemProps = {
  mode: string;
  ownedProjects: Project[];
  sharedProjects: ProjectsWithOwner[];
}

//props of groups
type GroupProps = {
  groups: GroupsWithOwner[];
  updateGroups: () => void;
};

type ModalState = {
  isShow: boolean;
  selections: Project[];
};

class AddProjectItem extends React.Component<GroupProps & ProjectItemProps,
  ModalState
> {
  componentDidMount() {
    this.props.updateGroups();
    flattenOwnedProject(this.props.ownedProjects, this.state.selections);
    flattenSharedProject(this.props.sharedProjects, this.state.selections);
  }

  state: ModalState = {
    isShow: false,
    selections: []
  };

  showModal = () => {
    this.setState({ isShow: true });
  };

  onCancel = () => {
    this.setState({ isShow: false });
  };

  render() {
    console.log(this.state.selections);
    const modal = (
    <Modal
      title='Create New BuJo Item'
      visible={this.state.isShow}
      onCancel={this.onCancel}
      footer={[
        <Button key='cancel' onClick={this.onCancel}>
          Cancel
        </Button>,
        <Button
          key='create'
          type='primary'
        >
          Create
        </Button>
      ]}
    >
      <div>
        <Select defaultValue="lucy" style={{ width: 120 }}>
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select>
      </div>
    </Modal>);
      if (this.props.mode === 'MyBuJo') {
        return (
          <div>
            <Tooltip placement="bottom" title='Create New BuJo Item' >
              <h2 className='add-todo-button' onClick={this.showModal}>
                <PlusOutlined />
              </h2>
            </Tooltip>
            {modal}
          </div>
        );
      }
      return (
        <div>
          <Tooltip placement="bottom" title='Create New BuJo Item' >
            <PlusOutlined className='rotateIcon' onClick={this.showModal}/>
          </Tooltip>
          {modal}
        </div>
      );
  }
}

const mapStateToProps = (state: IState) => ({
  groups: state.group.groups,
  project: state.project.project,
  ownedProjects: state.project.owned,
  sharedProjects: state.project.shared
});

export default connect(mapStateToProps, { updateGroups, createProjectByName })(
  AddProjectItem
);
