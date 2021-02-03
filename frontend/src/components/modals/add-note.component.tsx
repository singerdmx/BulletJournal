import React, { useEffect, useState } from 'react';
import {Modal, Input, Form, Button, Select, Tooltip} from 'antd';
import { PlusOutlined, EnvironmentOutlined } from '@ant-design/icons';
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
import {Button as FloatButton, darkColors, lightColors} from "react-floating-action-button";
import {useHistory} from "react-router-dom";
import {PlusCircleTwoTone} from "@ant-design/icons/lib";
import SearchBar from '../map-search-bar/search-bar.component';

const { Option } = Select;

type NoteProps = {
  project: Project | undefined;
};

interface NoteCreateFormProps {
  mode: string;
  createNote: (projectId: number, name: string, location: string, labels: number[]) => void;
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
  const history = useHistory();
  const [location, setLocation] = useState('');
  const { projectId } = useParams();

  useEffect(() => {
    if (projectId) {
      props.labelsUpdate(parseInt(projectId));
    }
  }, []);

  const addNote = (values: any) => {
    if (project) {
      props.createNote(project.id, values.noteName, location, values.labels);
    }
    props.updateNoteVisible(false);
  };

  const getLocationItem =() => {
	return <Form.Item label={<div><EnvironmentOutlined/><span style={{padding: '0 4px'}}>Location</span></div>}>
	  <SearchBar setLocation={setLocation} location={location}/>
	</Form.Item>;
  }

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
            rules={[{ required: true, message: 'Note Name must be between 1 and 50 characters', min: 1, max: 50 }]}
          >
            <Input placeholder='Enter Note Name' allowClear />
          </Form.Item>
          {location && location.length > 40 ? <Tooltip title={location} placement="bottom">
            {getLocationItem()}
          </Tooltip> : getLocationItem()}
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
      </div>
    );
  }
  return (
      <>
        <FloatButton
            tooltip="Add New Note"
            onClick={openModal}
            styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
        >
          <PlusOutlined/>
        </FloatButton>
        {getModal()}
      </>
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
