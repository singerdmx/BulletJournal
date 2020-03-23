import React from 'react';
import {
    FormOutlined,
    InfoCircleOutlined,
    MessageOutlined,
    MoreOutlined,
    DeleteTwoTone,
    EditTwoTone
  } from '@ant-design/icons';

import { Popover } from 'antd';

type NoteProps = {
    name: string,
    id: number,
    onDelete: (noteId: number) => void,
    onEdit: (noteId: number) => void
};


const Content:  React.FC<NoteProps> = props => {
    const { name, id, onDelete, onEdit } = props;
    return (<div style={{display: 'flex', flexDirection: 'column'}}>
        <div>Delete<DeleteTwoTone onClick={()=>onDelete(id)}/></div>
        <div>Edit  <EditTwoTone onClick={()=>onEdit(id)}/></div>
    </div>);
}

const alignConfig = {
    offset: [10, -5],  
}

const NoteItem: React.FC<NoteProps> = props => {
    const { name, id, onDelete, onEdit } = props;

    return (<div style={{width: '100%', height: '2rem', position: 'relative', lineHeight: '2rem'}}>
        <FormOutlined/>
        <span style={{padding: '0 5px', height: '100%'}}>{name}</span>
        <div style={{ width: '30%', height: '100%', position: 'absolute', top: 0, right: 0, display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
            <InfoCircleOutlined />
            <MessageOutlined />
            <Popover align={alignConfig} placement="bottomRight" style={{top: -10}} title={null} content={<Content name={''} id={id} onDelete={onDelete} onEdit={onEdit}/>} trigger="click">
                <MoreOutlined style={{transform: 'rotate(90deg)', fontSize: '20px'}}/>
            </Popover>
        </div>
    </div>);
}

export default NoteItem;