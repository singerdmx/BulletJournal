import React from 'react';
import { DashOutlined } from '@ant-design/icons';
import { List, Checkbox, Menu, Dropdown } from 'antd';

import './project-item.styles.less';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

interface ItemProps {
  title: string;
}

const handleCheck = (e: CheckboxChangeEvent) => {
  console.log(e);
};

const todoMenu = (
  <Menu>
    <Menu.Item key="edit">Edit</Menu.Item>
    <Menu.Item key="delete">Delete</Menu.Item>
  </Menu>
);

const TodoItem = (props: ItemProps) => {
  return (
    <List.Item>
      <div className="todo-content">
        <div className="check">
          <Checkbox onChange={e => handleCheck(e)} />
        </div>
        <div className="content">{props.title}</div>
      </div>
      <div className="selector">
        <Dropdown overlay={todoMenu} trigger={['click']}>
          <DashOutlined />
        </Dropdown>
      </div>
    </List.Item>
  );
};

export default TodoItem;
