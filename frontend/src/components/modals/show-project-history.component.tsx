import React, { useState } from 'react';
import { IState } from '../../store';
import { Project } from '../../features/project/interface';
import { Modal, Tooltip, Select, DatePicker, Divider } from 'antd';
import { HistoryOutlined, SyncOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
const { Option } = Select;
const { RangePicker } = DatePicker;

type ShowProjectHistoryProps = {
  project: Project | undefined;
};

const ShowProjectHistory: React.FC<ShowProjectHistoryProps> = ({ project }) => {
  const [visible, setVisible] = useState(false);
  const onCancel = () => setVisible(false);
  const openModal = () => setVisible(true);

  if (!project) {
    return null;
  }

  return (
    <Tooltip title='Show History'>
      <div className='show-project-history'>
        <HistoryOutlined
          style={{ fontSize: 20, cursor: 'pointer' }}
          onClick={openModal}
        />
        <Modal
          title={`BuJo "${project.name}" History`}
          visible={visible}
          onCancel={onCancel}
          footer={false}
        >
          <div>
            <div>
              <RangePicker />
              <span className='history-refresh-button'>
                <Tooltip title='Refresh'>
                  <SyncOutlined />
                </Tooltip>
              </span>
            </div>
            <div style={{ display: 'flex' }}>
              <span>
                <Select
                  style={{ width: '150px', marginRight: '30px' }}
                  placeholder='Select Person'
                >
                  <Option key='aa' value='aa'>
                    aa
                  </Option>
                  <Option key='bb' value='bb'>
                    bb
                  </Option>
                </Select>
              </span>
              <span>
                <Select
                  style={{ width: '150px', marginRight: '30px' }}
                  placeholder='Select Action'
                >
                  <Option key='aa' value='aa'>
                    aa
                  </Option>
                  <Option key='bb' value='bb'>
                    bb
                  </Option>
                </Select>
              </span>
            </div>
          </div>
        </Modal>
      </div>
    </Tooltip>
  );
};

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
});

export default connect(mapStateToProps, {})(ShowProjectHistory);
