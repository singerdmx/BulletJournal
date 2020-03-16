import React, { useState, useEffect, FC } from 'react';
import { connect } from 'react-redux';
import { Label, stringToRGB } from '../../features/label/interface';
import {
  labelsUpdate,
  deleteLabel,
  patchLabel,
  createLabel
} from '../../features/label/actions';
import {
  Input,
  Form,
  Tag,
  Button,
  Modal,
  Select,
  message,
  Tooltip
} from 'antd';
import { iconOptions, icons } from '../../assets/icons/index';
import {
  SearchOutlined,
  PlusCircleOutlined,
  TagOutlined,
  DeleteOutlined
} from '@ant-design/icons';

type LabelsProps = {
  labels: Label[];
  labelsUpdate: () => void;
  deleteLabel: (labelId: number, name: string) => void;
  createLabel: (name: string, icon: string) => void;
  patchLabel: (labelId: number, value: string, icon: string) => void;
  startSearching: () => void;
};

type titleProps = {
  labelId: number;
  labelName: string;
  deleteHelper: (labelId: number, name: string) => void;
};

const EditorTitle: React.FC<titleProps> = props => {
  const { labelId, labelName, deleteHelper } = props;
  return (
    <span style={{display : "flex", justifyContent : "space-between", paddingRight : 20}}>
      <span>Edit</span>
      <Tooltip title="Delete Label">
        <Button
          type="link"
          danger
          onClick={() => deleteHelper(labelId, labelName)}
          style={{ padding: 0, fontWeight: 500, marginTop: '-4px'}}
          shape="circle" icon={<DeleteOutlined />} />
      </Tooltip>
    </span>
  );
};

const Labels: React.FC<LabelsProps> = props => {
  let initialLabel: Label = {} as Label;
  const [createForm] = Form.useForm();
  const [editFrom] = Form.useForm();
  const [editable, setEditable] = useState(false);
  const [currentLabel, setCurrentLabel] = useState(initialLabel);
  const [inputFocus, setFocus] = useState(false);

  useEffect(() => {
    props.labelsUpdate();
  }, []);

  const handleCreate = () => {
    createForm
      .validateFields()
      .then(values => {
        console.log(values);
        props.createLabel(values.labelName, values.labelIcon);
        createForm.resetFields();
      })
      .catch(info => {
        message.error(info);
      });
  };

  const handleDelete = (labelId: number, name: string) => {
    props.deleteLabel(labelId, name);
    setEditable(false);
  };

  const handleEditModal = (label: Label) => {
    setEditable(true);
    setCurrentLabel(label);
  };

  const handleUpdate = (labelId: number, name: string) => {
    editFrom
      .validateFields()
      .then(values => {
        props.patchLabel(labelId, values.labelValue, values.labelIcon);
        editFrom.resetFields();
        setEditable(false);
      })
      .catch(err => {
        message.error(err);
      });
  };

  const getIcon = (icon: string) => {
    let res = icons.filter(item => item.name === icon);
    return res.length > 0 ? res[0].icon : <TagOutlined />;
  };

  return (
    <div className="labels-create-page">
      <div className="labels-create">
        <Form form={createForm} layout="inline" onFinish={handleCreate}>
          <Form.Item
            style={{ flex: 1 }}
            name="labelIcon"
            rules={[{ required: true, message: 'Missing Icon' }]}
          >
            <Select bordered={false} onSelect={() => setFocus(true)} style={{width: '58px'}}>
              {iconOptions}
            </Select>
          </Form.Item>
          <Form.Item
            name="labelName"
            rules={[{ required: true, message: 'Missing Label Name' }]}
            style={{ flex: 7 }}
          >
            <Input
              placeholder="Input Label Name"
              className="labels-create-input"
              autoFocus={inputFocus}
              onBlur={() => setFocus(false)}
            />
          </Form.Item>
          <Form.Item style={{ flex: 1 }}>
            <Tooltip title="Click to create label">
              <Button type="link" htmlType="submit">
                <PlusCircleOutlined />
              </Button>
            </Tooltip>
          </Form.Item>
        </Form>
      </div>
      <div className="labels-container">
        <div className="labels-control">
          <div className="label-search">
            <Tooltip placement="top" title="Click to search by label(s)">
              <Button
                shape="circle"
                icon={<SearchOutlined />}
                onClick={props.startSearching}
              />
            </Tooltip>
          </div>
        </div>
        <div className="labels-list">
          {props.labels.map(label => {
            return (
              <Tooltip placement="top" title="Click to edit or delete label" key={label.id}>
                <Tag
                  className="labels"
                  color={stringToRGB(label.value)}
                  onClick={() => handleEditModal(label)}
                  style={{ cursor: 'pointer' }}
                >
                  {getIcon(label.icon)} &nbsp;
                  {label.value}
                </Tag>
              </Tooltip>
            );
          })}
        </div>
      </div>
      <Modal
        title={
          <EditorTitle
            labelId={currentLabel.id}
            labelName={currentLabel.value}
            deleteHelper={handleDelete}
          />
        }
        destroyOnClose
        visible={editable}
        onCancel={() => setEditable(false)}
        centered
        footer={[
          <Button
            key="cancel"
            onClick={() => setEditable(false)}
            type="default"
          >
            Cancel
          </Button>,
          <Button
            onClick={() => handleUpdate(currentLabel.id, currentLabel.value)}
            type="primary"
            key="update"
          >
            Update
          </Button>
        ]}
      >
        <Form form={editFrom} layout="inline">
          <Form.Item name="labelIcon">
            <Select
              onSelect={() => setFocus(true)}
              defaultValue={currentLabel.icon}
            >
              {iconOptions}
            </Select>
          </Form.Item>
          <Form.Item label="Name" name="labelValue">
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
