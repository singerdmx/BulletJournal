import React, { useState } from 'react';
import { Modal, Input, Button, Tooltip, Form } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps} from 'react-router';
import { createLabel } from '../../features/label/actions';
import './modals.styles.less';

interface LabelCreateFormProps {
    createLabel: (name: string) => void;
};

const AddLabel: React.FC<RouteComponentProps & LabelCreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const addLabel = (values: any) => {
    props.createLabel(values.labelName);
    setVisible(false);
  };
  const onCancel = () => setVisible(false);
  const openModal = () => setVisible(true);

    return (
    <Tooltip placement="top" title='Create New Label'>
      <div className="add-label" >
          <Button type="primary" shape="round" icon={<PlusCircleOutlined />} onClick={openModal}>
            New Label
          </Button>
          <Modal
          title="Create New Label"
          visible={visible}
          okText="Create"
          onCancel={onCancel}
          onOk={() => {
            form
              .validateFields()
              .then(values => {
                console.log(values);
                form.resetFields();
                addLabel(values);
              })
              .catch(info => console.log(info));
          }}
          >
            <Form form={form}>
              <Form.Item
                name="labelName"
                rules={[
                  { required: true, message: 'Please input Label Name!' }
                ]}
              >
                <Input placeholder="Enter Label Name" allowClear />
              </Form.Item>
          </Form>
        </Modal>
      </div>
    </Tooltip>
    );
}

export default connect(null, { createLabel })(withRouter(AddLabel));