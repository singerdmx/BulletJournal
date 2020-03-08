import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { Label, stringToRGB } from '../../features/label/interface';
import {
    labelsUpdate,
    deleteLabel,
    patchLabel,
    createLabel,
  } from '../../features/label/actions';
  import { Input, Form, Tag, AutoComplete, message, Button } from 'antd';

  import { SearchOutlined } from '@ant-design/icons';
type LabelsProps = {
    labels: Label[];
    labelsUpdate: () => void;
    deleteLabel: (labelId: number, name: string) => void;
    createLabel: (name: string) => void;
    patchLabel: (labelId: number, value: string) => void;
    startSearching : () => void;
  };
  
  const Labels: React.FC<LabelsProps> = (props) => {
    const [form] = Form.useForm();
    const [editable, setEditable] = useState(false);
    const [newLable, setNewLable] = useState('');
  
    useEffect(() => {
      props.labelsUpdate();
    }, []);
  
    const handleDelete = (labelId: number, name: string) => {
      props.deleteLabel(labelId, name);
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
            <Button shape="circle" icon={<SearchOutlined/>} onClick={props.startSearching}/>
          </div>
          <div className="edit-button">
            <Button
              type="primary"
              onClick={() => setEditable(editable => !editable)}
            >
              {editable ? 'Done' : 'Edit'}
            </Button>
          </div>
        </div>
        <div className="labels-list">
          {props.labels.map(label => {
            return (
              <Tag
                key={label.id}
                className="labels"
                color={editable ? "#fff" : stringToRGB(label.value)}
                closable={editable}
                onClose={() => handleDelete(label.id, label.value)}
              >
                {editable ? (
                  <Input
                    size="small"
                    className="labels-edit"
                    defaultValue={label.value}
                  />
                ) : (
                  label.value
                )}
              </Tag>
            );
          })}
        </div>
      </div>
    </div>
    )
  }

export default connect(null, {
    labelsUpdate,
    deleteLabel,
    createLabel,
    patchLabel
  })(Labels);