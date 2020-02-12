import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { List } from 'antd';

interface RouteParams {
  category: string;
}

const fakeData = ['Frontend', 'Bakcend', 'UI designer'];
const TodoPage = (props: RouteComponentProps<RouteParams>) => {
  return (
    <div className="todo">
      <div className="todo-header">
        <h2>{props.match.params.category.toUpperCase()} </h2>
        <div className="todo-list">
          <List
            itemLayout="horizontal"
            dataSource={fakeData}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
        </div>
      </div>
    </div>
  );
};

export default TodoPage;
