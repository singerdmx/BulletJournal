import React, {useState} from 'react';
import {Button, Form, Modal, Result, Select, Tabs, Tooltip} from 'antd';
import {LinkOutlined, ShareAltOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import './modals.styles.less';
import {getProjectItemType, ProjectType} from "../../features/project/constants";
import ShareProjectItemWithGroup from "../../features/share-project-item/share-item-with-group";
import ShareProjectItemWithUser from "../../features/share-project-item/share-item-with-user";

const {TabPane} = Tabs;
const {Option} = Select;

type ProjectItemProps = {
  mode: string;
  type: ProjectType;
  projectItemId: number;
};

const ShareProjectItem: React.FC<ProjectItemProps> = props => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const {mode} = props;

  const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setVisible(false);
  };

  const openModal = () => {
    setVisible(true);
  };

  const getModal = () => {

    return (
        <Modal
            title={`SHARE ${getProjectItemType(props.type)}`}
            destroyOnClose
            centered
            visible={visible}
            onCancel={e => handleCancel(e)}
            footer={[
              <Button
                  key="cancel"
                  onClick={e => handleCancel(e)}
                  type="default"
              >
                Close
              </Button>
            ]}
        >
          <div>
            <Tabs defaultActiveKey='Group' tabPosition={'left'}>
              <TabPane tab='Group' key='Group'>
                <ShareProjectItemWithGroup type={props.type} projectItemId={props.projectItemId}/>
              </TabPane>
              <TabPane tab='User' key='User'>
                <ShareProjectItemWithUser type={props.type} projectItemId={props.projectItemId}/>
              </TabPane>
              <TabPane tab='Link' key='Link'>
                <Result
                    icon={<LinkOutlined/>}
                    title={`Generate Shareable LINK`}
                />
              </TabPane>
              <TabPane tab='Manage' key='Manage'>
                <Result
                    icon={<LinkOutlined/>}
                    title={`Manage Shared ${getProjectItemType(props.type)}`}
                />
              </TabPane>
            </Tabs>
          </div>
        </Modal>
    );
  };

  const getDiv = () => {
    if (mode === 'div') {
      return (
          <div onClick={openModal} className='popover-control-item'>
            <span>Share</span>
            <ShareAltOutlined/>
            {getModal()}
          </div>
      );
    }
    return (
        <Tooltip title={`SHARE ${getProjectItemType(props.type)}`}>
          <div>
              <span onClick={openModal}>
                <ShareAltOutlined/>
                {getModal()}
              </span>
          </div>
        </Tooltip>
    );
  };

  return getDiv();
};

export default connect(null, {})(ShareProjectItem);
