import React from 'react';
import { BugOutlined, MessageOutlined } from '@ant-design/icons';
import { Modal, Tabs } from 'antd';
import Feedback from "../contact-us/feedback.component";
import Issue from "../contact-us/issue.component";

const { TabPane } = Tabs;

type ContactUsProps = {
  visible: boolean;
  onCancel: (e: any) => void;
};

const ContactUs: React.FC<ContactUsProps> = ({ visible, onCancel }) => {

  return (
    <Modal
      title='Contact Support'
      visible={visible}
      onCancel={onCancel}
      footer={false}
    >
      <Tabs type='card'>
        <TabPane
          tab={
            <span>
              <MessageOutlined />
              Feedback
            </span>
          }
          key='Feedback'
        >
          <Feedback/>
        </TabPane>
        <TabPane
          tab={
            <span>
              <BugOutlined />
              Issue
            </span>
          }
          key='Issue'
        >
          <Issue/>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default ContactUs;
