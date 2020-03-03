import React from 'react';
import { Modal, Input, Form, Button } from 'antd';
import { FolderAddOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { createProjectByName } from '../../features/project/actions';
import { ProjectType } from '../../features/project/constants';

import './modals.styles.less';

type ProjectProps = {
  createProjectByName: (description: string, groupId: number, name: string,
                        projectType: ProjectType) => void;
};

type ModalState = {
  isShow: boolean;
};

class AddProject extends React.Component<ProjectProps, ModalState> {
  state: ModalState = {
    isShow: false
  };

  showModal = () => {
    this.setState({ isShow: true });
  };

  addProject = (name: string, description: string, groupId: number,
    projectType: ProjectType) => {
    this.props.createProjectByName(description, groupId, name, projectType);
    this.setState({ isShow: false });
  };

  onCancel = () => {
    this.setState({ isShow: false });
  };

  render() {
    return (
      <div className="add-project" title='Create New BuJo'>
        <Button onClick={this.showModal} type="dashed" block>
          <FolderAddOutlined style={{ fontSize: 20 }} />
        </Button>
        <Modal
          title="Create New BuJo"
          visible={this.state.isShow}
          onCancel={this.onCancel}
          onOk={() => this.addProject}
        >
          <Form>
            <Form.Item>
              <Input placeholder="Enter BuJo Name"/>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default connect(null, { createProjectByName })(AddProject);