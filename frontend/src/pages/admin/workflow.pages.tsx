import React, {useEffect} from 'react';
import { ScheduleOutlined } from '@ant-design/icons';
import './workflow.styles.less';
import {BackTop} from "antd";

type WorkflowPageProps = {
};

const AdminWorkflowPage: React.FC<WorkflowPageProps> = (props) => {
    useEffect(() => {
        document.title = 'Bullet Journal - Workflow';
    }, []);

    return (
    <div className='workflow-page'>
        <BackTop />

        <ScheduleOutlined />
    </div>
  );
};


export default AdminWorkflowPage;
