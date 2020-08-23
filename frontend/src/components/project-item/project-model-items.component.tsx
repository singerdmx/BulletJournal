import React from 'react';
import {Badge, Collapse, Empty, List, Timeline} from 'antd';
import {
  CreditCardOutlined,
  CarryOutOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { ProjectItems } from '../../features/myBuJo/interface';
import NoteItem from './note-item.component';
import TaskItem from './task-item.component';
import TransactionItem from './transaction-item.component';
import {ProjectItemUIType} from "../../features/project/constants";

const { Panel } = Collapse;

type ProjectModelItemsProps = {
  projectItems: ProjectItems[];
  completeOnlyOccurrence: boolean;
  type: ProjectItemUIType;
};

const getTasksPanel = (
  items: ProjectItems,
  index: number,
  type: ProjectItemUIType,
  completeOnlyOccurrence: boolean
) => {
  if (items.tasks.length === 0) {
    return null;
  }
  return (
    <Panel
      header={<Badge count={items.tasks.length} style={{backgroundColor: 'grey'}} offset={[20, 6]} title='Count'>
        <span>
          {items.dayOfWeek}
        </span>
      </Badge>}
      key={`tasks${index}`}
      extra={<CarryOutOutlined />}
    >
      {items.tasks.map((item, index) => {
        return (
          <div key={`task${item.id}#${index}`}>
            <TaskItem
              task={item}
              type={type}
              isComplete={false}
              readOnly={false}
              inProject={false}
              completeOnlyOccurrence={completeOnlyOccurrence}
            />
          </div>
        );
      })}
    </Panel>
  );
};

const getTransactionsPanel = (items: ProjectItems, type: ProjectItemUIType, index: number) => {
  if (items.transactions.length === 0) {
    return null;
  }
  return (
    <Panel
      header={<Badge count={items.transactions.length} style={{backgroundColor: 'grey'}} offset={[20, 6]} title='Count'>
        <span>
          {items.dayOfWeek}
        </span>
      </Badge>}
      key={`transactions${index}`}
      extra={<CreditCardOutlined />}
    >
      <List>
        {items.transactions.map((item, index) => {
          return (
            <div key={`transactions${item.id}#${index}`}>
              <TransactionItem transaction={item} inProject={false} type={type}/>
            </div>
          );
        })}
      </List>
    </Panel>
  );
};

const getNotesPanel = (items: ProjectItems, index: number, type: ProjectItemUIType) => {
  if (items.notes.length === 0) {
    return null;
  }
  return (
    <Panel
      header={<Badge count={items.notes.length} style={{backgroundColor: 'grey'}} offset={[20, 6]} title='Count'>
        <span>
          {items.dayOfWeek}
        </span>
      </Badge>}
      key={`notes${index}`}
      extra={<FileTextOutlined />}
    >
      <List>
        {items.notes.map((item, index) => {
          return (
            <div key={`note${item.id}#${index}`}>
              <NoteItem note={item} readOnly={false} inProject={false} type={type}/>
            </div>
          );
        })}
      </List>
    </Panel>
  );
};

const ProjectModelItems: React.FC<ProjectModelItemsProps> = (props) => {
  if (!props.projectItems || props.projectItems.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>;
  }
  return (
    <Timeline mode={'left'}>
      {props.projectItems.map((items, index) => {
        return (
          <Timeline.Item
            key={index}
            label={items.date}
            style={{ marginLeft: '-65%' }}
          >
            <Collapse
              defaultActiveKey={[
                'tasks' + index,
                'transactions' + index,
                'notes' + index,
              ]}
            >
              {getTasksPanel(items, index, props.type, props.completeOnlyOccurrence)}
              {getTransactionsPanel(items, props.type, index)}
              {getNotesPanel(items, index, props.type)}
            </Collapse>
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
};

export default ProjectModelItems;
