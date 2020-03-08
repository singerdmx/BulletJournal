import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, message, AutoComplete, Input, PageHeader } from 'antd';
import { Label } from '../../features/label/interface';

type LabelSearchProps = {
  labelOptions: Label[];
  endSearching : () => void;
};

const LabelsSearching: React.FC<LabelSearchProps> = props => {
  const [form] = Form.useForm();
  return (
    <div className="labels-search-container">
      <PageHeader title="Search Item With Label" onBack={props.endSearching}/>
      <div className="label-search-input">
        <Form form={form}>
          <Form.Item
            name="labelName"
            rules={[{ required: true, message: 'Please input Label Name!' }]}
          >
            <AutoComplete
              children={
                <Input
                  placeholder="Seach By Label"
                  className="label-search-input"
                  onPressEnter={e => {
                    form
                      .validateFields()
                      .then(values => {
                        // call search api here
                        form.resetFields();
                      })
                      .catch(info => message.error(info));
                  }}
                />
              }
              options={props.labelOptions}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LabelsSearching;
