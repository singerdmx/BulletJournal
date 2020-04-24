import React from 'react';
import { Collapse, Empty, List, Timeline } from 'antd';
import {
  AccountBookOutlined,
  CarryOutOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { ProjectItems } from '../../features/myBuJo/interface';
import NoteItem from './note-item.component';
import TaskItem from './task-item.component';
import TransactionItem from './transaction-item.component';

const { Panel } = Collapse;

type ProjectModelItemsProps = {
  projectItems: ProjectItems[];
  completeOnyOccurrence: boolean;
};

const getTasksPanel = (
  items: ProjectItems,
  index: number,
  completeOnyOccurrence: boolean
) => {
  if (items.tasks.length === 0) {
    return null;
  }
  return (
    <Panel
      header={items.dayOfWeek}
      key={`tasks${index}`}
      extra={<CarryOutOutlined />}
    >
      {items.tasks.map((item, index) => {
        return (
          <div key={`task${item.id}#${index}`}>
            <TaskItem
              task={item}
              isComplete={false}
              readOnly={false}
              completeOnyOccurrence={completeOnyOccurrence}
            />
          </div>
        );
      })}
    </Panel>
  );
};

const getTransactionsPanel = (items: ProjectItems, index: number) => {
  if (items.transactions.length === 0) {
    return null;
  }
  return (
    <Panel
      header={items.dayOfWeek}
      key={`transactions${index}`}
      extra={<AccountBookOutlined />}
    >
      <List>
        {items.transactions.map((item, index) => {
          return (
            <div key={`transactions${item.id}#${index}`}>
              <TransactionItem transaction={item} />
            </div>
          );
        })}
      </List>
    </Panel>
  );
};

const getNotesPanel = (items: ProjectItems, index: number) => {
  if (items.notes.length === 0) {
    return null;
  }
  return (
    <Panel
      header={items.dayOfWeek}
      key={`notes${index}`}
      extra={<FileTextOutlined />}
    >
      <List>
        {items.notes.map((item, index) => {
          return (
            <div key={`note${item.id}#${index}`}>
              <NoteItem note={item} readOnly={false} />
            </div>
          );
        })}
      </List>
    </Panel>
  );
};

const ProjectModelItems: React.FC<ProjectModelItemsProps> = (props) => {
  if (!props.projectItems || props.projectItems.length === 0) {
    return <Empty />;
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
              {getTasksPanel(items, index, props.completeOnyOccurrence)}
              {getTransactionsPanel(items, index)}
              {getNotesPanel(items, index)}
            </Collapse>
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
};

export default ProjectModelItems;
