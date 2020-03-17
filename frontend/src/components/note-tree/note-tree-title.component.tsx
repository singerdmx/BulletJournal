import React from 'react';
import {
    FormOutlined
  } from '@ant-design/icons';

type NoteProps = {
    title: string
};

const NoteTitle: React.FC<NoteProps> = props => {
    const { title } = props;

    return (<div style={{width: '100%'}}>
        <FormOutlined/>
        <span style={{padding: '0 5px'}}>{title}</span>
    </div>);
}

export default NoteTitle;