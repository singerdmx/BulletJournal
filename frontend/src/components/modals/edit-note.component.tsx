import React, {useState} from 'react';
import {Input, Modal} from 'antd';
import {
    EditTwoTone,
} from '@ant-design/icons';
import './modals.styles.less';
import {patchNote} from '../../features/notes/actions';
import {connect} from 'react-redux';
import {IState} from '../../store';
import {Note} from '../../features/notes/interface';


type NoteProps = {
    note: Note;
    patchNote: (noteId: number, content: string) => void;
};

const EditNote: React.FC<NoteProps> = props => {
    const { note, patchNote} = props;
    const [visible, setVisible] = useState(false);

    const [value, setValue] = useState('');
    const onOk = () => {
        patchNote(note.id, value);
        setVisible(!visible)
    };

    return (<div onClick={()=>setVisible(!visible)} style={{ cursor: 'pointer' }}>
                <span>Edit</span>
                <EditTwoTone />
                <Modal
                    title='Edit'
                    visible={visible}
                    onOk={onOk}
                    okText="Confirm"
                    cancelText="Cancel"
                    onCancel={() => setVisible(!visible)}
                >
                    <div><Input placeholder={note.name} onChange={e => setValue(e.target.value)}/></div>
                </Modal>
            </div>);
};

const mapStateToProps = (state: IState) => ({
});

export default connect(mapStateToProps, {patchNote})(
    EditNote
);