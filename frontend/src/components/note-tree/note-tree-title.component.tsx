import React from 'react';
import {
    FormOutlined,
    InfoCircleOutlined,
    MessageOutlined,
    MoreOutlined
  } from '@ant-design/icons';

type NoteProps = {
    title: string
};

const NoteTitle: React.FC<NoteProps> = props => {
    const { title } = props;

    return (<div style={{width: '100%', height: '2rem', position: 'relative', lineHeight: '2rem'}}>
        <FormOutlined/>
        <span style={{padding: '0 5px', height: '100%'}}>{title}</span>
        <div style={{ width: '30%', height: '100%', position: 'absolute', top: 0, right: 0, display: 'flex', justifyContent: 'space-evenly', alignItems: 'center'}}>
            <InfoCircleOutlined />
            <MessageOutlined />
            <MoreOutlined style={{transform: 'rotate(90deg)', fontSize: '20px'}}/>
        </div>
    </div>);
}

export default NoteTitle;