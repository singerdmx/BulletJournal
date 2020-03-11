import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, message, AutoComplete, Input, PageHeader, Tag } from 'antd';
import { Label } from '../../features/label/interface';
import {
  addSelectedLabel,
  removeSelectedLabel
} from '../../features/label/actions';
import { IState } from '../../store';

type LabelSearchProps = {
  labelOptions: Label[];
  labelsSelected: Label[];
  addSelectedLabel: (val: string) => void;
  removeSelectedLabel: (val: string) => void;
  endSearching: () => void;
};

const LabelsSearching: React.FC<LabelSearchProps> = props => {
  const [form] = Form.useForm();
  return (
    <div className="labels-search-container">
      <PageHeader title="Search Item With Label" subTitle="Click To Choose Label" onBack={props.endSearching} />
      <div className="label-search-input">
        <Form form={form}>
          <Form.Item
            name="labelName"
            rules={[{ required: true, message: 'Please input Label Name!' }]}
          >
            <AutoComplete
              children={
                <Input
                  placeholder="Press Enter To Get Result"
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
              onSelect={value => props.addSelectedLabel(value)}
            />
          </Form.Item>
        </Form>
      </div>
      <div className="selected-labels">
        {props.labelsSelected.map(label => (
          <Tag
            key={label.id}
            closable
            onClose={() => props.removeSelectedLabel(label.value)}
          >
            {label.value}
          </Tag>
        ))}
      </div>
      <div className="search-results">
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  labelsSelected: state.label.labelsSelected
});

export default connect(mapStateToProps, {
  addSelectedLabel,
  removeSelectedLabel
})(LabelsSearching);
