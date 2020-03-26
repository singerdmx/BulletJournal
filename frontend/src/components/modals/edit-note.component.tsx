import React, {useState} from 'react';
import {Input, Modal} from 'antd';
import './modals.styles.less';
import {patchNote} from '../../features/notes/actions';
import {connect} from 'react-redux';
import {IState} from '../../store';
import {Note} from '../../features/notes/interface';


type NoteProps = {
    note: Note;
    patchNote: (noteId: number, content: string) => void;
    visible: boolean;
    setVisible: (visible: boolean) => void;
};

const EditNote: React.FC<NoteProps> = props => {
    const {visible, setVisible, note, patchNote} = props;
    const [value, setValue] = useState('');
    const onOk = () => {
        patchNote(note.id, value);
        setVisible(!visible)
    };

    return (<div>
        <Modal
            title="Title"
            visible={props.visible}
            onOk={onOk}
            okText="Confirm"
            cancelText="Cancel"
            onCancel={() => setVisible(!visible)}
        >
            <div><Input placeholder='text' onChange={e => setValue(e.target.value)}/></div>
        </Modal>
    </div>);
};

const mapStateToProps = (state: IState) => ({
});

export default connect(mapStateToProps, {patchNote})(
    EditNote
);