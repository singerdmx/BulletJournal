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
import {useHistory, useParams} from 'react-router-dom';
import { labelsUpdate } from '../../features/label/actions';
import {onFilterLabel} from "../../utils/Util";
import {PlusCircleTwoTone} from "@ant-design/icons/lib";
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
  const [form] = Form.useForm();
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const { projectId } = useParams();

  const updateNote = (values: any) => {
    patchNote(note.id, values.noteName, values.labels);
  }

  useEffect(() => {
    if (projectId) {
      labelsUpdate(parseInt(projectId));
    }
  }, [projectId]);

  const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setVisible(false);
  };

  const openModal = () => {
    setVisible(true);
  };

  const getModal = () => {
    return (
      <Modal
        title='Edit'
        okText='Confirm'
        cancelText='Cancel'
        onOk={() => {
          form
              .validateFields()
              .then((values) => {
                form.resetFields();
                setVisible(!visible);
                updateNote(values);
              })
              .catch((info) => console.log(info));
        }}
        destroyOnClose
        visible={visible}
        onCancel={(e) => handleCancel(e)}
      >
        <Form
          layout='vertical'
          form={form}
        >
          <Form.Item
              name='noteName'
              label='Name'
              rules={[{message: 'Note Name must be between 1 and 50 characters', min: 1, max: 50}]}
          >
            <Input
                allowClear
                placeholder='Enter Note Name'
                defaultValue={note.name ? note.name : ''}
            />
          </Form.Item>
          {/* label */}
          <div>
            <Form.Item name="labels" label={
              <Tooltip title="Click to go to labels page to create label">
                <span style={{cursor: 'pointer'}} onClick={() => history.push('/labels')}>
                  Labels&nbsp;<PlusCircleTwoTone />
                </span>
              </Tooltip>
            }>
              <Select
                mode='multiple'
                filterOption={(e, t) => onFilterLabel(e, t)}
                defaultValue={note.labels.map((l) => {
                  return l.id;
                })}
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
        onClick={openModal}
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
