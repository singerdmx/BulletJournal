import React from 'react';
import TaskList from '../components/task-list/task-list.component';
import BujoCalender from '../components/bujo-calender/bujo-calender.component';
import { Icon, Modal, Form, Input, Checkbox } from 'antd';
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
      <div className="todo">
        <div className="todo-header">
          <h2>{category.toUpperCase()} </h2>
          <Checkbox.Group defaultValue={['todo']} className="header-check">
            <Checkbox value="todo">
              <Icon type="carry-out" title="TODO" />
            </Checkbox>
            <Checkbox value="ledger">
              <Icon type="account-book" title="LEDGER" />
            </Checkbox>
          </Checkbox.Group>

          <h2 className="add-todo-button" onClick={this.showForm}>
            <Icon type="plus" />
          </h2>
        </div>
        
        {category === 'today' ? <TaskList data={fakeData} /> : <BujoCalender />}
        <Modal
          title="Create Task"
          visible={this.state.showForm}
          onOk={this.handleCreate}
          onCancel={this.handleCancel}
          centered={true}
          okText="Create"
        >
          <Form>
            <Form.Item>
              <Input placeholder="titie" />
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
