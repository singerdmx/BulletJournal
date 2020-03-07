import React from 'react';
import TaskList from '../components/task-list/task-list.component';
import BujoCalendar from '../components/bujo-calendar/bujo-calendar.component';
import {
  AccountBookOutlined,
  CarryOutOutlined,
  PlusOutlined
} from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input, Checkbox, Tooltip } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

type BujoRouteParams = {
  category: string;
};
interface BujoRouteProps extends RouteComponentProps<BujoRouteParams> {
  category: string;
}

type todoState = {
  showForm: boolean;
};
const fakeData = ['Frontend', 'Bakcend', 'UI designer'];

class BujoPage extends React.Component<BujoRouteProps, todoState> {
  state: todoState = {
    showForm: false
  };

  showForm = () => {
    this.setState({ showForm: true });
  };

  handleCancel = () => {
    this.setState({ showForm: false });
  };

  handleCreate = () => {
    this.setState({ showForm: false });
  };

  render() {
    const { category } = this.props.match.params;
    return (
      <div className='todo'>
        <div className='todo-header'>
          <Checkbox.Group defaultValue={['todo']} className='header-check'>
            <Checkbox value='todo'>
              <Tooltip placement="top" title='TODO'>
                <CarryOutOutlined  />
              </Tooltip>
            </Checkbox>
            <Checkbox value='ledger'>
              <Tooltip placement="top" title='LEDGER'>
                <AccountBookOutlined />
              </Tooltip>
            </Checkbox>
          </Checkbox.Group>

          <h2 className='add-todo-button' onClick={this.showForm}>
            <PlusOutlined />
          </h2>
        </div>

        {category === 'today' ? <TaskList data={fakeData} /> : <BujoCalendar />}
        <Modal
          title='Create Task'
          visible={this.state.showForm}
          onOk={this.handleCreate}
          onCancel={this.handleCancel}
          centered={true}
          okText='Create'
        >
          <Form>
            <Form.Item>
              <Input placeholder='titie' />
            </Form.Item>
            <Form.Item>
              <Input.TextArea allowClear={true} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default BujoPage;
