import React from 'react';
import {
    FormOutlined,
    InfoCircleOutlined,
    MessageOutlined,
    MoreOutlined
  } from '@ant-design/icons';

import { Popover } from 'antd';

type NoteProps = {
    name: string
};

const text = <span>Title</span>;
const content = (
  <div>
    <p>Content</p>
    <p>Content</p>
  </div>
);

const alginConfig = {
    offset: [10, -5],  
}

const NoteItem: React.FC<NoteProps> = props => {
    const { name } = props;

    return (<div style={{width: '100%', height: '2rem', position: 'relative', lineHeight: '2rem'}}>
        <FormOutlined/>
        <span style={{padding: '0 5px', height: '100%'}}>{name}</span>
        <div style={{ width: '30%', height: '100%', position: 'absolute', top: 0, right: 0, display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
            <InfoCircleOutlined />
            <MessageOutlined />
            <Popover align={alginConfig} placement="bottomRight" style={{top: -10}} title={text} content={content} trigger="click">
                <MoreOutlined style={{transform: 'rotate(90deg)', fontSize: '20px'}}/>
            </Popover>
        </div>
    </div>);
}

export default NoteItem;