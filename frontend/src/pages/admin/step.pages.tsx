import React, {useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import {connect} from "react-redux";
import {deleteStep, getStep, setStepChoices, updateStep} from "../../features/templates/actions";
import {IState} from "../../store";
import {Step} from "../../features/templates/interface";
import {BackTop, Button, Divider, InputNumber, Tooltip, Typography} from "antd";
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
}

const AdminStepPage: React.FC<AdminStepProps> = (
    {step, getStep, deleteStep, setStepChoices, updateStep}) => {
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
    </div>
}

const mapStateToProps = (state: IState) => ({
    step: state.templates.step,
});

export default connect(mapStateToProps, {
    getStep, deleteStep, setStepChoices, updateStep
})(AdminStepPage);