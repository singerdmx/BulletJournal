import React from 'react';
import { connect } from 'react-redux';
import { Form, Select, PageHeader, Button } from 'antd';
import { Label } from '../../features/label/interface';
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
            rules={[{ required: true, message: 'Missing Label(s)' }]}
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
