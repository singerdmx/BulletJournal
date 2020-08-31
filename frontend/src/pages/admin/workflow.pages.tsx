import React, {useEffect, useState} from 'react';
import {Container} from "react-floating-action-button";
import './workflow.styles.less';
import {BackTop, Button, Divider, Input} from "antd";
import AddChoice from "../../components/modals/templates/add-choice.component";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getChoices} from "../../features/templates/actions";
import {Choice, Selection} from "../../features/templates/interface";
import AdminChoiceElem from "./admin-choice-elem";

type WorkflowPageProps = {
    choices: Choice[];
    selections: Selection[];
    getChoices: () => void;
};

const AdminWorkflowPage: React.FC<WorkflowPageProps> = (
    {
        choices,
        selections,
        getChoices
    }) => {
    useEffect(() => {
        document.title = 'Bullet Journal - Workflow';
        getChoices();
    }, []);
    const [choice, setChoice] = useState(choices[0]);

    if (choices.length === 0) {
        return <div></div>
    }
    return (
        <div className='workflow-page'>
            <BackTop/>
            <div>
                <h3>Choices</h3>
                {choices.map(c => {
                    return <div onClick={() => setChoice(c)}>
                        <AdminChoiceElem
                            choice={c}
                            showPopover={false}/>
                    </div>
                })}
            </div>
            <Divider/>
            <div>
                <h3>Selections</h3>
                <div>
                    <b>Target Choice: {choice.name} ({choice.id})</b>
                </div>
                <div>
                    Add Selection:{' '}
                    <span>
                        <Input allowClear style={{width: '140px'}} placeholder='Selection Text'></Input>
                    </span>
                    {' '}
                    <Button type='primary'>Add to Target Choice</Button>
                </div>
                <div>
                    {selections.map(s => {
                        return <span>{s.text} ({s.id})</span>
                    })}
                </div>
            </div>
            <Container>
                <AddChoice/>
            </Container>
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    choices: state.templates.choices,
    selections: state.templates.selections
});

export default connect(mapStateToProps, {
    getChoices,
})(AdminWorkflowPage);
