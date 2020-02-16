import React from 'react';
import TodoItem from '../components/todo-item/todo-item.component';
import { List, Icon, Modal, Form, Input } from 'antd';
import { RouteComponentProps } from 'react-router-dom';

type RouteParams = {
  category: string;
};
interface RouteProps extends RouteComponentProps<RouteParams> {
  category: string;
}

type todoState = {
  showForm: boolean;
};

const fakeData = ['Frontend', 'Bakcend', 'UI designer'];
class TodoPage extends React.Component<RouteProps, todoState> {
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
    return (
      <div className="todo">
        <div className="todo-header">
          <h2>{this.props.match.params.category.toUpperCase()} </h2>
          <h2 className="add-todo-button" onClick={this.showForm}>
            <Icon type="plus" />
          </h2>
        </div>
        <div className="todo-list">
          <List
            itemLayout="horizontal"
            dataSource={fakeData}
            renderItem={item => <TodoItem title={item} />}
          />
        </div>
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

export default TodoPage;
