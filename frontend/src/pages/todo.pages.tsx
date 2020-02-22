import React from 'react';
import TodoItem from '../components/todo-item/todo-item.component';
import { List, Icon, Modal, Form, Input, Checkbox, DatePicker } from 'antd';
import { RouteComponentProps } from 'react-router-dom';
import moment from 'moment';

type TdoRouteParams = {
  category: string;
};
interface TodoRouteProps extends RouteComponentProps<TdoRouteParams> {
  category: string;
}

type todoState = {
  showForm: boolean;
};

const { MonthPicker, RangePicker } = DatePicker;
const fakeData = ['Frontend', 'Bakcend', 'UI designer'];
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY'];

class TodoPage extends React.Component<TodoRouteProps, todoState> {
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
          <Checkbox><Icon type="carry-out" title="TODO"/></Checkbox>
          <Checkbox><Icon type="account-book" title="Ledger"/></Checkbox>
          <h2 className="add-todo-button" onClick={this.showForm}>
            <Icon type="plus" />
          </h2>
        </div>
        <div>
          <RangePicker
            defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]}
            format={dateFormat}
          />
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
