import React from 'react';
import { Modal, Empty } from 'antd';
import { IState } from '../../store';
import { connect } from 'react-redux';
import './modals.styles.less';
import NoteItem from '../project-item/note-item.component';
import { Note } from '../../features/notes/interface';
import { User } from '../../features/group/interface';

type NotesByOwnerProps = {
  notesByOwner: Note[];
  visible: boolean;
  owner: User | undefined;
  onCancel: () => void;
};

const NotesByOwner: React.FC<NotesByOwnerProps> = (props) => {
  const { visible, owner, notesByOwner } = props;
  return (
    <Modal
      title={`Note(s) created by ${owner ? owner.alias : ''}`}
      visible={visible}
      onCancel={props.onCancel}
      footer={false}
    >
      {notesByOwner.length === 0 ? (
        <Empty />
      ) : (
        notesByOwner.map((note, index) => {
          return (
            <div key={index}>
              <NoteItem note={note} readOnly={false} inProject={false} />
            </div>
          );
        })
      )}
    </Modal>
  );
};

const mapStateToProps = (state: IState) => ({
  notesByOwner: state.note.notesByOwner,
});

export default connect(mapStateToProps, {})(NotesByOwner);
