import React, {useEffect} from 'react';
import {Container} from "react-floating-action-button";
import './workflow.styles.less';
import {BackTop} from "antd";
import AddChoice from "../../components/modals/templates/add-choice.component";
import AdminChoices from "./admin-choices";

type WorkflowPageProps = {};

const AdminWorkflowPage: React.FC<WorkflowPageProps> = (props) => {
    useEffect(() => {
        document.title = 'Bullet Journal - Workflow';
    }, []);

    return (
        <div className='workflow-page'>
            <BackTop/>
            <div>
                <h3>Choices</h3>
                <AdminChoices
                    showPopover={false}
                    showAddChoice={false}
                    addChoice={() => {
                    }}
                    choicesToExclude={[]}/>
            </div>
            <Container>
                <AddChoice/>
            </Container>
        </div>
    );
};

export default AdminWorkflowPage;
