import React from 'react';
import { connect } from 'react-redux';
import { Form, Select, PageHeader, Button, Timeline, Collapse, Tooltip, Divider } from 'antd';
import { Label } from '../../features/label/interface';
import { getItemsByLabels } from '../../features/label/actions';
import { IState } from '../../store';
import { SearchOutlined, CarryOutOutlined, AccountBookOutlined, FileTextOutlined } from '@ant-design/icons';
import { ProjectItems } from '../../features/myBuJo/interface';

const { Panel } = Collapse;

type LabelSearchProps = {
  labelOptions: Label[];
  items: ProjectItems[];
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

  const getTasksPanel = (items: ProjectItems, index: number) => {
    if (items.tasks.length === 0) {
      return null;
    }
    return (
      <Panel
        header={items.dayOfWeek}
        key={`tasks${index}`}
        extra={<CarryOutOutlined />}
      ></Panel>
    );
  };

  const getTransactionsPanel = (items: ProjectItems, index: number) => {
    if (items.transactions.length === 0) {
      return null;
    }
    return (
      <Panel
        header={items.dayOfWeek}
        key={`transactions${index}`}
        extra={<AccountBookOutlined />}
      ></Panel>
    );
  };

  const getNotesPanel = (items: ProjectItems, index: number) => {
    if (items.notes.length === 0) {
      return null;
    }
    return (
      <Panel
        header={items.dayOfWeek}
        key={`transactions${index}`}
        extra={<FileTextOutlined />}
      ></Panel>
    );
  };

  return (
    <div className="labels-search-container">
      <PageHeader
        title="Search By Label(s)"
        subTitle="Click to choose label(s)"
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
            <Tooltip placement="top" title="Search">
              <Button shape="circle" type="primary" htmlType="submit">
                <SearchOutlined />
              </Button>
            </Tooltip>
          </Form.Item>
        </Form>
      </div>
      <Divider />
      <div>
      {
          <Timeline mode={'left'}>
            {props.items.map((items, index) => {
              return (
                <Timeline.Item
                  key={items.date}
                  label={items.date}
                  style={{ marginLeft: '-65%' }}
                >
                  <Collapse
                    defaultActiveKey={[
                      'tasks' + index,
                      'transactions' + index
                    ]}
                  >
                    {getTasksPanel(items, index)}
                    {getTransactionsPanel(items, index)}
                    {getNotesPanel(items, index)}
                  </Collapse>
                </Timeline.Item>
              );
            })}
          </Timeline>
          }
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  labelsSelected: state.label.labelsSelected,
  items: state.label.items
});

export default connect(mapStateToProps, {
  getItemsByLabels
})(LabelsSearching);
