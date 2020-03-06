import React from 'react';
import { Divider, Button } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import './pages.style.less';

const LablesPage = () => {
  return (
    <div className='labels'>
        <Button title="Add New Label" type="primary" shape="round" icon={<PlusCircleOutlined />} >
          New Label
        </Button>
        <Divider />
    </div>
  );
};

export default LablesPage;