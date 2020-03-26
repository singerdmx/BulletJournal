import React, { useEffect, useState } from 'react';
import { Avatar, Form, Input, Modal, Select, Tooltip, Button } from 'antd';
import './modals.styles.less';
import { patchNote } from '../../features/notes/actions';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { Note } from '../../features/notes/interface';


type NoteProps = {
    note: Note;
    patchNote: (noteId: number, content: string) => void;
    patchLoading: boolean;
    visible: boolean;
    setVisible: (visible: boolean) => void;
  };

const EditNote: React.FC<NoteProps> = props => {
  const { visible, setVisible, note, patchNote } = props;
    const [value, setValue] = useState('');
    const onOk = () => {
      patchNote(note.id, value)
      setVisible(!visible)
    };


    return (<div>
      <Modal
          title="Title"
          visible={props.visible}
          onOk={onOk}
          confirmLoading={props.patchLoading}
          okText="确认"
          cancelText="取消"
          onCancel={()=>setVisible(!visible)}
        >
          <div><Input placeholder='text' onChange={e=>setValue(e.target.value)}/></div>
        </Modal>
    </div>);
}

const mapStateToProps = (state: IState) => ({
  patchLoading: state.note.patchLoading
});

export default connect(mapStateToProps, { patchNote })(
    EditNote
  );