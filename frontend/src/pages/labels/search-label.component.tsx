import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {BackTop, Button, Divider, Form, PageHeader, Select, Tooltip} from 'antd';
import {Label} from '../../features/label/interface';
import {getItemsByLabels} from '../../features/label/actions';
import {IState} from '../../store';
import {SearchOutlined} from '@ant-design/icons';
import {ProjectItems} from '../../features/myBuJo/interface';
import ProjectModelItems from '../../components/project-item/project-model-items.component';
import {ProjectItemUIType} from "../../features/project/constants";
import {onFilterLabel} from "../../utils/Util";

type LabelSearchProps = {
  labelOptions: Label[];
  defaultLabels: Label[];
  items: ProjectItems[];
  getItemsByLabels: (labels: []) => void;
  endSearching: () => void;
};

const LabelsSearching: React.FC<LabelSearchProps> = (props) => {
  const [form] = Form.useForm();
  const { defaultLabels } = props;
  const handleSearch = () => {
    form.validateFields().then((values) => {
      if (!values) {
        return;
      }
      props.getItemsByLabels(values.selectLabels);
    });
  };

  const initialValues = {
    selectLabels: defaultLabels.map((label) => label.id),
  };

  useEffect(() => {
    handleSearch();
    document.title = 'Bullet Journal - Labels';
  }, []);

  return (
    <div className='labels-search-container'>
      <BackTop />
      <PageHeader
        title='Search By Label(s)'
        subTitle='Click to choose label(s)'
        onBack={props.endSearching}
      />
      <div className='label-search-input'>
        <Form
          form={form}
          layout='inline'
          onFinish={handleSearch}
          initialValues={initialValues}
        >
          <Form.Item
            name='selectLabels'
            rules={[{ required: true, message: 'Missing Label(s)' }]}
            style={{ flex: 5 }}
          >
            <Select mode='multiple'
                    filterOption={(e, t) => onFilterLabel(e, t)}
            >
              {props.labelOptions &&
                props.labelOptions.map((option) => {
                  return (
                    <Select.Option key={option.value} value={option.id}>
                      {option.value}
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
          <Form.Item style={{ flex: 1 }}>
            <Tooltip placement='top' title='Search'>
              <Button shape='circle' type='primary' htmlType='submit'>
                <SearchOutlined />
              </Button>
            </Tooltip>
          </Form.Item>
        </Form>
      </div>
      <Divider />
      <div>
        <ProjectModelItems
          projectItems={props.items}
          completeOnlyOccurrence={false}
          type={ProjectItemUIType.LABEL}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  items: state.label.items,
});

export default connect(mapStateToProps, {
  getItemsByLabels,
})(LabelsSearching);
