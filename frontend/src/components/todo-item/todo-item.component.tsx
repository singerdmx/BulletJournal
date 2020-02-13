import React from 'react';
import { List, Checkbox, Icon, Menu, Dropdown } from 'antd';

import './todo-item.styles.less';
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
          <Icon type="dash" />
        </Dropdown>
      </div>
    </List.Item>
  );
};

export default TodoItem;
