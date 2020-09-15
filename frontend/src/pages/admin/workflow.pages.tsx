import React, {useEffect, useState} from 'react';
import {Container} from "react-floating-action-button";
import './workflow.styles.less';
import {BackTop, Button, Divider, Input, Tabs} from "antd";
import AddChoice from "../../components/modals/templates/add-choice.component";
import {IState} from "../../store";
import {connect} from "react-redux";
import {addSelection, getChoices, getSteps} from "../../features/templates/actions";
import {Choice, Step} from "../../features/templates/interface";
import AdminChoiceElem from "./admin-choice-elem";
import Search from "antd/es/input/Search";
import {CheckCircleTwoTone, FilterOutlined} from "@ant-design/icons";
import {useHistory} from "react-router-dom";

const {TabPane} = Tabs;

type WorkflowPageProps = {
    choices: Choice[];
    steps: Step[];
    getChoices: () => void;
    getSteps: () => void;
    addSelection: (choiceId: number, text: string) => void;
};

const AdminWorkflowPage: React.FC<WorkflowPageProps> = (
    {
        choices,
        steps,
        getChoices,
        addSelection,
        getSteps,
    }) => {
    const history = useHistory();

    useEffect(() => {
        document.title = 'Bullet Journal - Workflow';
        getChoices();
        getSteps();
    }, []);
    const [choice, setChoice] = useState(choices[0]);
    const [selectionText, setSelectionText] = useState('');
    const [targetStep, setTargetStep] = useState<Step | undefined>(undefined);

    if (choices.length === 0) {
        return <div></div>
    }
    return (
        <div className='workflow-page'>
            <BackTop/>
            <Tabs defaultActiveKey="2">
                <TabPane tab="Choices" key="1">
                    <div>
                        <h3>Choices</h3>
                        {choices.map(c => {
                            return <div onClick={() => setChoice(c)}>
                                <AdminChoiceElem
                                    choice={c}/>
                            </div>
                        })}
                    </div>
                    <Divider/>
                    <div>
                        <h3>Selection</h3>
                        <div>
                            <b>Target Choice: {choice && choice.name} ({choice && choice.id})</b>
                        </div>
                        <div>
                            Add Selection:{' '}
                            <span>
                                <Input allowClear
                                       onChange={(e) => setSelectionText(e.target.value)}
                                       value={selectionText}
                                       style={{width: '140px'}} placeholder='Selection Text'></Input>
                            </span>
                            {' '}
                            <Button type='primary' onClick={() => addSelection(choice.id, selectionText)}>
                                Add to Target Choice</Button>
                        </div>
                    </div>
                </TabPane>
                <TabPane tab="Sample Tasks" key="2">
                    <div>
                        <h3>Steps</h3>
                        {steps.map((s) => {
                            return (
                                <div>
                                    <span style={{cursor: 'pointer', padding: '5px'}}
                                          onClick={() => history.push(`/admin/steps/${s.id}`)}>{s.name} ({s.id})
                                    </span>
                                    <CheckCircleTwoTone onClick={() => setTargetStep(s)}/>
                                </div>

                            );
                        })}
                    </div>
                    <Divider/>
                    <div>
                        <div>
                            <b>Target Step:</b> {targetStep ? targetStep.name : 'None'}
                        </div>
                        <h3>Tasks</h3>
                        <div>
                            <Search style={{width: '40%', padding: '5px'}} placeholder="Search Sample Tasks"
                                    onSearch={value => console.log(value)} enterButton/>
                            <Input style={{width: '40%', padding: '5px', margin: '5px'}} placeholder="Filter"
                                   prefix={<FilterOutlined/>}/>
                        </div>
                    </div>
                </TabPane>
            </Tabs>
            <Container>
                <AddChoice/>
            </Container>
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    choices: state.templates.choices,
    steps: state.templates.steps,
});

export default connect(mapStateToProps, {
    getChoices,
    addSelection,
    getSteps,
})(AdminWorkflowPage);
