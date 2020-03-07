import React from 'react';
import { Divider, Button, Tooltip } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import './pages.style.less';

const LablesPage = () => {
  return (
    <div className='labels'>
        <Tooltip placement="top" title="Add New Label">
          <Button type="primary" shape="round" icon={<PlusCircleOutlined />} >
            New Label
          </Button>
        </Tooltip>
        <Divider />
    </div>
  );
};

export default LablesPage;