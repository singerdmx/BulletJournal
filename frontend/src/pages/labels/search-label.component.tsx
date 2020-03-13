import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Select, PageHeader, Tag, Button } from 'antd';
import { Label, stringToRGB } from '../../features/label/interface';
import { getItemsByLabels } from '../../features/label/actions';
import { IState } from '../../store';
import { SearchOutlined } from '@ant-design/icons';

type LabelSearchProps = {
  labelOptions: Label[];
  getItemsByLabels: (labels: []) => void;
  endSearching: () => void;
};

const LabelsSearching: React.FC<LabelSearchProps> = props => {
  const [form] = Form.useForm();

  const handleSearch = () => {
    form.validateFields().then(values => {
      if (!values) {
        return;
      }
      props.getItemsByLabels(values.selectLabels);
    });
  };
  const tagsRender = (props: any) => {
    console.log(props);
  };
  return (
    <div className="labels-search-container">
      <PageHeader
        title="Search Item With Label"
        subTitle="Click To Choose Label"
        onBack={props.endSearching}
      />
      <div className="label-search-input">
        <Form form={form} layout="inline" onFinish={handleSearch}>
          <Form.Item
            name="selectLabels"
            rules={[{ required: true, message: 'Please input Label Name!' }]}
            style={{ flex: 5 }}
          >
            <Select mode="multiple">
              {props.labelOptions &&
                props.labelOptions.map(option => {
                  return (
                    <Select.Option key={option.id} value={option.id}>
                      {option.value}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
          <Form.Item style={{ flex: 1 }}>
            <Button shape="circle" type="primary" htmlType="submit">
              <SearchOutlined />
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="search-results"></div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  labelsSelected: state.label.labelsSelected
});

export default connect(mapStateToProps, {
  getItemsByLabels
})(LabelsSearching);
