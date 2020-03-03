import React from 'react';
import { Modal, Input, Form, Button, Select } from 'antd';
import { FolderAddOutlined, CarryOutOutlined, FileTextOutlined, AccountBookOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { createProjectByName } from '../../features/project/actions';
import { ProjectType } from '../../features/project/constants';

import './modals.styles.less';

const InputGroup = Input.Group;
const { TextArea } = Input;
const { Option } = Select;

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
              <InputGroup compact>
                <Select placeholder="Choose Project Type">
                  <Option value="TODO" title="Project Type: TODO"><CarryOutOutlined />&nbsp;TODO</Option>
                  <Option value="NOTE" title="Project Type: NOTE"><FileTextOutlined />&nbsp;NOTE</Option>
                  <Option value="LEDGER" title="Project Type: LEDGER"><AccountBookOutlined />&nbsp;LEDGER</Option>
                </Select>
                <Input style={{ width: '60%' }} placeholder="Enter BuJo Name"/>
                <div style={{ margin: '24px 0' }} />
                <TextArea placeholder="Enter Description" autoSize />
              </InputGroup>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default connect(null, { createProjectByName })(AddProject);