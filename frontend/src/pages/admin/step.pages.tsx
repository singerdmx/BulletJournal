import React, {useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import {connect} from "react-redux";
import {deleteStep, getStep, setStepChoices, updateStep, deleteRule} from "../../features/templates/actions";
import {IState} from "../../store";
import {Step} from "../../features/templates/interface";
import {BackTop, Button, Divider, InputNumber, Tooltip, Typography, Tag} from "antd";
import './steps.styles.less'
import {DeleteFilled, DeleteTwoTone} from "@ant-design/icons";
import AdminChoiceElem from "./admin-choice-elem";
import AdminChoices from "./admin-choices";
import {Container} from "react-floating-action-button";
import AddRule from "../../components/modals/templates/add-rule.component";

const {Title, Text} = Typography;

type AdminStepProps = {
    step: Step | undefined;
    getStep: (stepId: number) => void;
    deleteStep: (stepId: number) => void;
    setStepChoices: (id: number, choices: number[]) => void;
    updateStep: (stepId: number, name: string, nextStepId: number | undefined) => void;
    deleteRule: (ruleId: number, ruleType: string) => void;
}

const AdminStepPage: React.FC<AdminStepProps> = (
    {step, getStep, deleteStep, setStepChoices, updateStep, deleteRule}) => {
    const history = useHistory();
    const {stepId} = useParams();

    useEffect(() => {
        if (stepId) {
            getStep(parseInt(stepId));
        }
    }, [stepId]);

    if (!step) {
        return <div>{stepId} Not Found</div>
    }

    const handleDelete = (e: any) => {
        deleteStep(step.id);
        history.goBack();
    }

    const removeChoice = (step: Step, id: number) => {
        setStepChoices(step.id, step.choices.map(c => c.id).filter(c => c !== id));
    }

    const addChoice = (step: Step, id: number) => {
        const choices = step.choices.map(c => c.id);
        choices.push(id);
        setStepChoices(step.id, choices);
    }

    const removeExcludedSelection = (id: number) => {
        
    }

    const nameChange = (input: any) => {
        console.log(input);
        updateStep(step.id, input, step.nextStepId);
    }

    return <div className='steps-page'>
        <BackTop/>
        <div><DeleteFilled onClick={handleDelete}/></div>
        <Title editable={{onChange: nameChange}}>{step.name}</Title>
        <div></div>
        <Divider/>
        <h3>Choices</h3>
        {step.choices.map(c => {
            return <div>
                <AdminChoiceElem choice={c}/>
                {' '}
                <Tooltip title='Remove Choice'>
                    <DeleteTwoTone style={{cursor: 'pointer'}} onClick={() => removeChoice(step, c.id)}/>
                </Tooltip>
            </div>
        })}
        <Divider/>
        <div>
            <h3>Available Choices to add</h3>
            <AdminChoices
                showAddChoice={true}
                addChoice={(id) => addChoice(step, id)}
                choicesToExclude={step.choices.map(c => c.id)}/>
        </div>
        <Divider/>
        <div>
            <h3>Excluded Selections</h3>
            <div>
                <InputNumber/> <Button type='primary'>Add to Exclusion</Button>
            </div>
            <div>
                {step.excludedSelections.map(s => <span>
                            {s.text} ({s.id})
                    <DeleteFilled style={{cursor: 'pointer'}} onClick={() => removeExcludedSelection(s.id)}/>
                        </span>)}
            </div>
        </div>
        <Container>
            <AddRule step={step} category={undefined}/>
        </Container>
        <Divider/>
        <div>
            <h3>Rules</h3>
            {step && step.rules && step.rules.map(rule => {
                return <div><span>
                    <Tag>{rule.ruleExpression}</Tag> [{rule.name}] (Priority: {rule.priority}, ID: {rule.id})</span>
                    {' '} <span style={{cursor: 'pointer', color: 'lightBlue'}} onClick={() => history.push(`/admin/steps/${rule.connectedStep.id}`)}>
                        Step: {rule.connectedStep.name} ({rule.connectedStep.id})</span>
                    <DeleteTwoTone onClick={() => deleteRule(rule.id, 'STEP_RULE')}/>
                </div>
            })}
        </div>
    </div>
}

const mapStateToProps = (state: IState) => ({
    step: state.templates.step,
});

export default connect(mapStateToProps, {
    getStep, deleteStep, setStepChoices, updateStep, deleteRule
})(AdminStepPage);