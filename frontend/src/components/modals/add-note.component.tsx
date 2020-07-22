import React, { useEffect } from 'react';
import { Modal, Input, Tooltip, Form, Button, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps, useParams } from 'react-router';
import { createNote } from '../../features/notes/actions';
import { IState } from '../../store';
import { updateNoteVisible } from '../../features/notes/actions';
import './modals.styles.less';
import { Project } from '../../features/project/interface';
import { labelsUpdate } from '../../features/label/actions';
import { Label } from '../../features/label/interface';
import { getIcon } from '../draggable-labels/draggable-label-list.component';
import {onFilterLabel} from "../../utils/Util";
const { Option } = Select;

type NoteProps = {
  project: Project | undefined;
};

interface NoteCreateFormProps {
  mode: string;
  createNote: (projectId: number, name: string, labels: number[]) => void;
  updateNoteVisible: (visible: boolean) => void;
  addNoteVisible: boolean;
  labelOptions: Label[];
  labelsUpdate: (projectId: number | undefined) => void;
}

const AddNote: React.FC<
  RouteComponentProps & NoteProps & NoteCreateFormProps
> = (props) => {
  const { project, mode } = props;
  const [form] = Form.useForm();
  const { projectId } = useParams();

  useEffect(() => {
    if (projectId) {
      props.labelsUpdate(parseInt(projectId));
    }
  }, []);

  const addNote = (values: any) => {
    if (project) {
      props.createNote(project.id, values.noteName, values.labels);
    }
    props.updateNoteVisible(false);
  };

  const onCancel = () => props.updateNoteVisible(false);
  const openModal = () => props.updateNoteVisible(true);
  const getModal = () => {
    return (
      <Modal
        title='Create New Note'
        visible={props.addNoteVisible}
        okText='Create'
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              console.log(values);
              form.resetFields();
              addNote(values);
            })
            .catch((info) => console.log(info));
        }}
      >
        <Form form={form}>
          <Form.Item
            name='noteName'
            rules={[{ required: true, message: 'Missing Note Name!' }]}
          >
            <Input placeholder='Enter Note Name' allowClear />
          </Form.Item>
          <div>
            <Form.Item name='labels' label='Labels'>
              <Select
                  mode='multiple'
                  filterOption={(e, t) => onFilterLabel(e, t)}>
                {props.labelOptions &&
                  props.labelOptions.length &&
                  props.labelOptions.map((l) => {
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

  if (mode === 'button') {
    return (
      <div className='add-note'>
        <Button type='primary' onClick={openModal}>
          Create New Note
        </Button>
        {getModal()}
      </div>
    );
  }
  return (
    <Tooltip placement='top' title='Create New Note'>
      <div className='add-note'>
        <PlusOutlined
          style={{ fontSize: 20, cursor: 'pointer' }}
          onClick={openModal}
          title='Create New Note'
        />
        {getModal()}
      </div>
    </Tooltip>
  );
};

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  addNoteVisible: state.note.addNoteVisible,
  labelOptions: state.label.labelOptions,
});

export default connect(mapStateToProps, {
  createNote,
  updateNoteVisible,
  labelsUpdate,
})(withRouter(AddNote));
