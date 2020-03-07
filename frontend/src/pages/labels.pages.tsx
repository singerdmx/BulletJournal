import React from 'react';
import { Divider, Button, Tooltip } from 'antd';
import AddLabel from '../components/modals/add-label.component';

import './pages.style.less';

const LablesPage = () => {
  return (
    <div className='labels'>
        <AddLabel />
        <Divider />
    </div>
  );
};

export default LablesPage;