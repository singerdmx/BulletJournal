import React, {useEffect} from 'react';
import {Container} from "react-floating-action-button";
import './workflow.styles.less';
import {BackTop, Tabs} from "antd";
import AddChoice from "../../components/modals/templates/add-choice.component";
import {IState} from "../../store";
import {connect} from "react-redux";
import {useHistory} from "react-router-dom";
import AdminWorkflowChoices from "./workflow.choices";
import AdminWorkflowTasks from "./workflow.tasks";

const {TabPane} = Tabs;

type WorkflowPageProps = {};

const AdminWorkflowPage: React.FC<WorkflowPageProps> = (
    {}) => {
    const history = useHistory();

    useEffect(() => {
        document.title = 'Bullet Journal - Workflow';
    }, []);
    return (
        <div className='workflow-page'>
            <BackTop/>
            <Tabs defaultActiveKey="2">
                <TabPane tab="Choices" key="1">
                    <AdminWorkflowChoices/>
                </TabPane>
                <TabPane tab="Sample Tasks" key="2">
                    <AdminWorkflowTasks/>
                </TabPane>
            </Tabs>
            <Container>
                <AddChoice/>
            </Container>
        </div>
    );
};

const mapStateToProps = (state: IState) => ({});

export default connect(mapStateToProps, {})(AdminWorkflowPage);
