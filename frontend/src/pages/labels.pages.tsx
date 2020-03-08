import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IState } from '../store/index';
import { Input, Form, Tag, AutoComplete, message, Button } from 'antd';
import { Label, stringToRGB } from '../features/label/interface';
import { createLabel } from '../features/label/actions';
import {
  labelsUpdate,
  deleteLabel,
  addSelectedLabel,
  removeSelectedLabel
} from '../features/label/actions';

import './pages.style.less';

type LabelsProps = {
  labels: Label[];
  labelsSelected: Label[];
  labelOptions: Label[];
  labelsUpdate: () => void;
  deleteLabel: (labelId: number, name: string) => void;
  addSelectedLabel: (val: string) => void;
  removeSelectedLabel: (val: string) => void;
  createLabel: (name: string) => void;
};

const LablesPage: React.FC<LabelsProps> = props => {
  const [form] = Form.useForm();
  const [editable, setEditable] = useState(false);
  const [newLable, setNewLable] = useState('');
  useEffect(() => {
    props.labelsUpdate();
  }, []);

  const handleDelete = (labelId: number, name: string) => {
    props.deleteLabel(labelId, name);
  };

  const handleChange = (e: any) => {
    setEditable(e.target.value);
  };

  return (
    <div className="labels-page">
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
              options={props.labelOptions}
              value={newLable}
              onChange={value => setNewLable(value)}
            />
          </Form.Item>
        </Form>
      </div>
      <div className="labels-container">
        <div className="labels-control">
          <div className="label-search">
            <Input.Search placeholder="Search Label" />
          </div>
          <div className="edit-button">
            <Button type="primary" onClick={() => setEditable(editable => !editable)}>{editable ? "Done" : "Edit"}</Button>
          </div>
        </div>
        <div className="labels-list">
          {props.labels.map(label => {
            return (
              <Tag
                key={label.id}
                className="labels"
                color={stringToRGB(label.value)}
                closable={editable}
                onClose={() => handleDelete(label.id, label.value)}
              >
                {editable ? <Input size="small" className="labels-edit" defaultValue={label.value}/> : label.value}
              </Tag>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  labels: state.label.labels,
  labelsSelected: state.label.labelsSelected,
  labelOptions: state.label.labelOptions
});

export default connect(mapStateToProps, {
  labelsUpdate,
  deleteLabel,
  addSelectedLabel,
  removeSelectedLabel,
  createLabel
})(LablesPage);
