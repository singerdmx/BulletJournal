import React, { useState, useEffect } from 'react';
import { Input, Modal, Tooltip, Form, Select } from 'antd';
import { EditTwoTone } from '@ant-design/icons';
import './modals.styles.less';
import { patchNote } from '../../features/notes/actions';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { Note } from '../../features/notes/interface';
import { Label } from '../../features/label/interface';
import { getIcon } from '../draggable-labels/draggable-label-list.component';
import { useParams } from 'react-router-dom';
import { labelsUpdate } from '../../features/label/actions';
import {onFilterLabel} from "../../utils/Util";
const { Option } = Select;
type NoteProps = {
  mode: string;
  note: Note;
  patchNote: (noteId: number, name: string, labels: number[]) => void;
  labelOptions: Label[];
  labelsUpdate: (projectId: number | undefined) => void;
};

const EditNote: React.FC<NoteProps> = (props) => {
  const { note, patchNote, mode, labelOptions, labelsUpdate } = props;
  const [visible, setVisible] = useState(false);
  const [labels, setLabels] = useState([] as number[]);
  const { projectId } = useParams();
  const [value, setValue] = useState(note.name);
  const onOk = () => {
    if (value) {
      patchNote(note.id, value, labels);
    }
    setVisible(!visible);
  };

  useEffect(() => {
    setValue(note.name);
  }, [note]);

  useEffect(() => {
    if (projectId) {
      labelsUpdate(parseInt(projectId));
    }
  }, []);

  const getModal = () => {
    return (
      <Modal
        title='Edit'
        okText='Confirm'
        cancelText='Cancel'
        onOk={onOk}
        destroyOnClose
        visible={visible}
        onCancel={() => setVisible(!visible)}
      >
        <Form
          layout='vertical'
          initialValues={{
            labels: note.labels.map((l) => {
              return l.id;
            }),
          }}
        >
          <Input
            onClick={(e) => e.stopPropagation()}
            value={value}
            placeholder={note.name}
            onChange={(e) => {
              e.stopPropagation();
              setValue(e.target.value);
            }}
          />
          {/* label */}
          <div onClick={(e) => e.stopPropagation()}>
            <Form.Item name='labels' label='Labels'>
              <Select
                mode='multiple'
                filterOption={(e, t) => onFilterLabel(e, t)}
                onChange={(value: number[]) => {
                  setLabels(value);
                }}
              >
                {labelOptions &&
                  labelOptions.length &&
                  labelOptions.map((l) => {
                    return (
                      <Option value={l.id} key={l.value}>
                        {getIcon(l.icon)} &nbsp;{l.value}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    );
  };

  if (mode === 'div') {
    return (
      <div
        onClick={() => setVisible(!visible)}
        className='popover-control-item'
      >
        <span>Edit</span>
        <EditTwoTone />
        {getModal()}
      </div>
    );
  }

  return (
    <>
      <Tooltip title={'Edit Note'}>
        <div>
          <EditTwoTone
            onClick={() => setVisible(!visible)}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </Tooltip>
      {getModal()}
    </>
  );
};

const mapStateToProps = (state: IState) => ({
  labelOptions: state.label.labelOptions,
});

export default connect(mapStateToProps, { patchNote, labelsUpdate })(EditNote);
