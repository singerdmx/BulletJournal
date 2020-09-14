import React, {useEffect, useState} from 'react';
import {Container} from "react-floating-action-button";
import './workflow.styles.less';
import {BackTop, Button, Divider, Input, Tabs} from "antd";
import AddChoice from "../../components/modals/templates/add-choice.component";
import {IState} from "../../store";
import {connect} from "react-redux";
import {addSelection, getChoices} from "../../features/templates/actions";
import {Choice} from "../../features/templates/interface";
import AdminChoiceElem from "./admin-choice-elem";

const {TabPane} = Tabs;

type WorkflowPageProps = {
    choices: Choice[];
    getChoices: () => void;
    addSelection: (choiceId: number, text: string) => void;
};

const AdminWorkflowPage: React.FC<WorkflowPageProps> = (
    {
        choices,
        getChoices,
        addSelection
    }) => {
    useEffect(() => {
        document.title = 'Bullet Journal - Workflow';
        getChoices();
    }, []);
    const [choice, setChoice] = useState(choices[0]);
    const [selectionText, setSelectionText] = useState('');

    if (choices.length === 0) {
        return <div></div>
    }
    return (
        <div className='workflow-page'>
            <BackTop/>
            <Tabs defaultActiveKey="1">
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
                    </div>
                    <Divider/>
                    <div>
                        <h3>Tasks</h3>
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
});

export default connect(mapStateToProps, {
    getChoices,
    addSelection
})(AdminWorkflowPage);
