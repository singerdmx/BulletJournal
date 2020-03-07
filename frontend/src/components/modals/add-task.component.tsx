import React from 'react';
import { Modal, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps} from 'react-router';
import { createTask } from '../../features/tasks/actions';
import { ReminderSetting } from '../../features/tasks/interface';
import { IState } from '../../store';
import './modals.styles.less';

type TaskProps = {
    projectId: number,
    createTask: (projectId: number, name: string, assignedTo: string,
        dueDate: string, dueTime: string, duration: number, reminderSetting: ReminderSetting) => void;
};

type ModalState = {
  isShow: boolean;
  taskName: string;
};

class AddTask extends React.Component<TaskProps & RouteComponentProps, ModalState> {
  state: ModalState = {
    isShow: false,
    taskName: ''
  };

  showModal = () => {
    this.setState({ isShow: true });
  };

  addTask = () => {
    // this.props.createTassk(this.props.projectId, this.state.taskName);
    this.setState({ isShow: false });
    this.props.history.push("/tasks")
  };

  onCancel = () => {
    this.setState({ isShow: false });
  };
  
  render() {
    return (
      <div className="add-task" title='Create New Task'>
        <PlusOutlined style={{ fontSize: 20, cursor: 'pointer' }} onClick={this.showModal} title='Create New Note' />
        <Modal
          title="Create New Task"
          visible={this.state.isShow}
          onCancel={this.onCancel}
          onOk={() => this.addTask}
          footer={[
            <Button key="cancel" onClick={this.onCancel}>
              Cancel
            </Button>,
            <Button key="create" type="primary" onClick={this.addTask}>
              Create
            </Button>
          ]}
        >
          <Input
            placeholder="Enter Task Name"
            onChange={e => this.setState({ taskName: e.target.value })}
            onPressEnter={this.addTask}
            allowClear
          />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
    projectId: state.project.project.id
  });

export default connect(mapStateToProps, { createTask })(withRouter(AddTask));