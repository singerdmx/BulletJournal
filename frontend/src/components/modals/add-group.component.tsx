import React, { useState } from 'react';
import { Modal, Input, Button, Tooltip, Form } from 'antd';
import { UsergroupAddOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { createGroupByName } from '../../features/group/actions';

import './modals.styles.less';

interface GroupCreateFormProps {
  createGroupByName: (name: string) => void;
}

const AddGroup: React.FC<RouteComponentProps & GroupCreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const addGroup = (values: any) => {
    props.createGroupByName(values.groupName);
    setVisible(false);
  };
  const onCancel = () => setVisible(false);
  const openModal = () => setVisible(true);
  return (
    <Tooltip placement="right" title="Create New Group">
      <div className="add-group">
        <Button onClick={openModal} type="dashed" block>
          <UsergroupAddOutlined style={{ fontSize: 20 }} />
        </Button>
        <Modal
          title="Create New Group"
          visible={visible}
          okText="Create"
          onCancel={onCancel}
          onOk={() => {
            form
              .validateFields()
              .then(values => {
                console.log(values);
                form.resetFields();
                addGroup(values);
              })
              .catch(info => console.log(info));
          }}
        >
          <Form form={form}>
            <Form.Item
              name="groupName"
              rules={[
                { required: true, message: 'Missing Group Name!' }
              ]}
            >
              <Input placeholder="Enter Group Name" allowClear />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Tooltip>
  );
};

export default connect(null, { createGroupByName })(withRouter(AddGroup));
