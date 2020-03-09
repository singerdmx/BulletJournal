import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Label, stringToRGB } from '../../features/label/interface';
import {
  labelsUpdate,
  deleteLabel,
  patchLabel,
  createLabel
} from '../../features/label/actions';
import { Input, Form, Tag, AutoComplete, message, Button, Modal } from 'antd';

import { SearchOutlined } from '@ant-design/icons';
type LabelsProps = {
  labels: Label[];
  labelsUpdate: () => void;
  deleteLabel: (labelId: number, name: string) => void;
  createLabel: (name: string) => void;
  patchLabel: (labelId: number, value: string) => void;
  startSearching: () => void;
};

const Labels: React.FC<LabelsProps> = props => {
  let initialLabel: Label = {} as Label;
  const [form] = Form.useForm();
  const [editFrom] = Form.useForm();
  const [editable, setEditable] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(initialLabel);
  const [newLable, setNewLable] = useState('');

  useEffect(() => {
    props.labelsUpdate();
  }, []);

  const handleDelete = (labelId: number, name: string) => {
    props.deleteLabel(labelId, name);
  };

  const handleEditModal = (label: Label) => {
    setEditable(true);
    setCurrentLabel(label);
  };

  const handleUpdate = (labelId: number, name: string) => {
    editFrom.validateFields().then(values => {
      props.patchLabel(labelId, values.labelValue);
      form.resetFields();
      setEditable(false);
    });
  };

  return (
    <div className="labels-create-page">
      <div className="labels-create">
        <Form form={form}>
          <Form.Item
            name="labelName"
            rules={[{ required: true, message: 'Please input Label Name!' }]}
          >
            <AutoComplete
              children={
                <Input
                  placeholder="Add Label"
                  className="labels-input"
                  onPressEnter={e => {
                    form
                      .validateFields()
                      .then(values => {
                        props.createLabel(values.labelName);
                        form.resetFields();
                      })
                      .catch(info => message.error(info));
                  }}
                />
              }
              options={[]}
              value={newLable}
              onChange={value => setNewLable(value)}
            />
          </Form.Item>
        </Form>
      </div>
      <div className="labels-container">
        <div className="labels-control">
          <div className="label-search">
            <Button
              shape="circle"
              icon={<SearchOutlined />}
              onClick={props.startSearching}
            />
          </div>
        </div>
        <div className="labels-list">
          {props.labels.map(label => {
            return (
              <Tag
                key={label.id}
                className="labels"
                color={stringToRGB(label.value)}
                onClose={() => handleDelete(label.id, label.value)}
                onClick={() => handleEditModal(label)}
              >
                {label.value}
              </Tag>
            );
          })}
        </div>
      </div>
      <Modal
        title={`Edit ${currentLabel.value} or Delete`}
        visible={editable}
        onCancel={() => setEditable(false)}
        centered
        footer={[
          <Button onClick={() => setEditable(false)} type="default">
            Cancel
          </Button>,
          <Button
            onClick={() =>
              props.deleteLabel(currentLabel.id, currentLabel.value)
            }
            type="danger"
          >
            Delete
          </Button>,
          <Button
            onClick={() => handleUpdate(currentLabel.id, currentLabel.value)}
            type="primary"
          >
            Update
          </Button>
        ]}
      >
        <Form form={editFrom}>
          <Form.Item label="Icon" name="labelIcon">
            <AutoComplete value={currentLabel.icon}></AutoComplete>
          </Form.Item>
          <Form.Item label="Value" name="labelValue">
            <Input
              defaultValue={currentLabel.value}
              value={currentLabel.value}
            ></Input>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(null, {
  labelsUpdate,
  deleteLabel,
  createLabel,
  patchLabel
})(Labels);
