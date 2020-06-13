import React, {useState} from 'react';
import {Checkbox, Empty, message, Modal, Tooltip} from 'antd';
import {IState} from '../../store';
import {connect} from 'react-redux';
import './modals.styles.less';
import NoteItem from '../project-item/note-item.component';
import {Note} from '../../features/notes/interface';
import {User} from '../../features/group/interface';
import {CheckSquareTwoTone, CloseSquareTwoTone, DeleteTwoTone,} from '@ant-design/icons';
import {deleteNotes} from '../../features/notes/actions';
import {Project} from '../../features/project/interface';
import {ProjectItemUIType} from "../../features/project/constants";

type NotesByOwnerProps = {
  project: Project | undefined;
  notesByOwner: Note[];
  visible: boolean;
  owner: User | undefined;
  onCancel: () => void;
  deleteNotes: (projectId: number, notesId: number[], type: ProjectItemUIType) => void;
};

const NotesByOwner: React.FC<NotesByOwnerProps> = (props) => {
  const { project, visible, owner, notesByOwner, deleteNotes } = props;

  const [checkboxVisible, setCheckboxVisible] = useState(false);
  const [checked, setChecked] = useState([] as number[]);
  const onCheck = (id: number) => {
    if (checked.includes(id)) {
      setChecked(checked.filter((c) => c !== id));
      return;
    }

    setChecked(checked.concat([id]));
  };

  const getList = () => {
    return notesByOwner.map((note, index) => {
      return (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          {checkboxVisible && (
            <Checkbox
              checked={checked.includes(note.id)}
              key={note.id}
              style={{ marginRight: '0.5rem', marginTop: '-0.5em' }}
              onChange={(e) => onCheck(note.id)}
            />
          )}
          <NoteItem
            note={note}
            type={ProjectItemUIType.OWNER}
            readOnly={false}
            inProject={false}
            inModal={true}
          />
        </div>
      );
    });
  };

  const selectAll = () => {
    setCheckboxVisible(true);
    setChecked(notesByOwner.map((n) => n.id));
  };

  const clearAll = () => {
    setCheckboxVisible(true);
    setChecked([]);
  };

  const deleteAll = () => {
    if (project === undefined) {
      return;
    }

    setCheckboxVisible(true);
    if (checked.length === 0) {
      message.error('No Selection');
      return;
    }

    deleteNotes(project.id, checked, ProjectItemUIType.OWNER);
    setChecked([] as number[]);
    props.onCancel();
  };

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
        <div>
          <div className='checkbox-actions'>
            <Tooltip title='Select All'>
              <CheckSquareTwoTone onClick={selectAll} />
            </Tooltip>
            <Tooltip title='Clear All'>
              <CloseSquareTwoTone onClick={clearAll} />
            </Tooltip>
            <Tooltip title='Delete All'>
              <DeleteTwoTone twoToneColor='#f5222d' onClick={deleteAll} />
            </Tooltip>
          </div>
          {getList()}
        </div>
      )}
    </Modal>
  );
};

const mapStateToProps = (state: IState) => ({
  notesByOwner: state.note.notesByOwner,
  project: state.project.project,
});

export default connect(mapStateToProps, { deleteNotes })(NotesByOwner);
