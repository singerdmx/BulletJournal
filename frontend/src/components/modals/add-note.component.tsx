import React, { useState } from 'react';
import { Modal, Input, Tooltip, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps} from 'react-router';
import { createNote } from '../../features/notes/actions';
import { IState } from '../../store';
import './modals.styles.less';

type NoteProps = {
    projectId: number;
};

interface NoteCreateFormProps {
  createNote: (projectId: number, name: string) => void;
};

const AddNote: React.FC<RouteComponentProps & NoteProps & NoteCreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const addNote = (values: any) => {
    props.createNote(props.projectId, values.noteName);
    setVisible(false);
  };
  const onCancel = () => setVisible(false);
  const openModal = () => setVisible(true);
    return (
      <Tooltip placement="top" title='Create New Note'>
        <div className="add-note" >
          <PlusOutlined style={{ fontSize: 20, cursor: 'pointer' }} onClick={openModal} title='Create New Note' />
          <Modal
            title="Create New Note"
            visible={visible}
            okText="Create"
            onCancel={onCancel}
            onOk={() => {
              form
                .validateFields()
                .then(values => {
                  console.log(values);
                  form.resetFields();
                  addNote(values);
                })
                .catch(info => console.log(info));
            }}
          >
              <Form form={form}>
                <Form.Item
                  name="noteName"
                  rules={[
                    { required: true, message: 'Please input Note Name!' }
                  ]}
                >
                  <Input placeholder="Enter Note Name" allowClear />
                </Form.Item>
            </Form>
          </Modal>
        </div>
      </Tooltip>
    );
}

const mapStateToProps = (state: IState) => ({
  projectId: state.project.project.id
});

export default connect(mapStateToProps, { createNote })(withRouter(AddNote));