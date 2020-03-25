import React from 'react';
import {
  DeleteTwoTone,
  DragOutlined,
  EditTwoTone,
  FormOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  MoreOutlined
} from '@ant-design/icons';

import { Popover } from 'antd';

type NoteProps = {
  name: string;
  id: number;
  onDelete: (noteId: number) => void;
  onEdit: (noteId: number) => void;
  onMove: (noteId: number, targetProject: number) => void;
};

const Content: React.FC<NoteProps> = props => {
  const { name, id, onDelete, onEdit, onMove } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div>
        Delete
        <DeleteTwoTone twoToneColor="#f5222d" onClick={() => onDelete(id)} />
      </div>
      <div>
        Edit <EditTwoTone onClick={() => onEdit(id)} />
      </div>
      <div>
        Move <DragOutlined onClick={() => onMove(id, 14)} />
      </div>
    </div>
  );
};

const alignConfig = {
  offset: [10, -5]
};

const NoteItem: React.FC<NoteProps> = props => {
  const { name, id, onDelete, onEdit, onMove } = props;

  return (
    <div
      style={{
        width: '100%',
        height: '2rem',
        position: 'relative',
        lineHeight: '2rem'
      }}
    >
      <FormOutlined />
      <span style={{ padding: '0 5px', height: '100%' }}>{name}</span>
      <div
        style={{
          width: '300px',
          height: '100%',
          position: 'absolute',
          top: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <InfoCircleOutlined style={{ marginRight: '1em' }} />
        <MessageOutlined style={{ marginRight: '1em' }} />
        <Popover
          align={alignConfig}
          placement="bottomRight"
          style={{ top: -10 }}
          title={null}
          content={
            <Content
              name={''}
              id={id}
              onDelete={onDelete}
              onEdit={onEdit}
              onMove={onMove}
            />
          }
          trigger="click"
        >
          <MoreOutlined
            style={{ transform: 'rotate(90deg)', fontSize: '20px' }}
          />
        </Popover>
      </div>
    </div>
  );
};

export default NoteItem;
