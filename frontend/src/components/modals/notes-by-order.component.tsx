import React from 'react';
import { Modal, Empty } from 'antd';
import { IState } from '../../store';
import { connect } from 'react-redux';
import './modals.styles.less';
import NoteItem from '../project-item/note-item.component';
import { Note } from '../../features/notes/interface';
import { User } from '../../features/group/interface';

type NotesByOrderProps = {
  notesByOrder: Note[];
  visible: boolean;
  onCancel: () => void;
};

const NotesByOrder: React.FC<NotesByOrderProps> = (props) => {
  const { visible, notesByOrder } = props;
  return (
    <Modal
      title={`title `}
      visible={visible}
      onCancel={props.onCancel}
      footer={false}
    >
      {notesByOrder.length === 0 ? (
        <Empty />
      ) : (
        notesByOrder.map((note, index) => {
          return (
            <div key={index}>
              <NoteItem
                note={note}
                readOnly={false}
                inProject={false}
                inModal={true}
              />
            </div>
          );
        })
      )}
    </Modal>
  );
};

const mapStateToProps = (state: IState) => ({
  notesByOrder: state.note.notesByOrder,
});

export default connect(mapStateToProps, {})(NotesByOrder);
