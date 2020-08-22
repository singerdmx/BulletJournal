import React, {useEffect} from 'react';
import {Container} from "react-floating-action-button";
import './workflow.styles.less';
import {BackTop} from "antd";
import AddChoice from "../../components/modals/templates/add-choice.component";

type WorkflowPageProps = {};

const AdminWorkflowPage: React.FC<WorkflowPageProps> = (props) => {
    useEffect(() => {
        document.title = 'Bullet Journal - Workflow';
    }, []);

    return (
        <div className='workflow-page'>
            <BackTop/>

            <Container>
                <AddChoice/>
            </Container>
        </div>
    );
};

export default AdminWorkflowPage;
