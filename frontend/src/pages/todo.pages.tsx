import React from 'react';
import TodoItem from '../components/todo-item/todo-item.component';
import { RouteComponentProps } from 'react-router-dom';
import { List, Icon } from 'antd';

interface RouteParams {
  category: string;
}

const fakeData = ['Frontend', 'Bakcend', 'UI designer'];
const TodoPage = (props: RouteComponentProps<RouteParams>) => {
  return (
    <div className="todo">
      <div className="todo-header">
        <h2>{props.match.params.category.toUpperCase()} </h2>
        <h2 className="add-todo-button"><Icon type="plus" />ADD</h2>
      </div>
      <div className="todo-list">
        <List
          itemLayout="horizontal"
          dataSource={fakeData}
          renderItem={item => <TodoItem title={item} />}
        />
      </div>
    </div>
  );
};

export default TodoPage;
