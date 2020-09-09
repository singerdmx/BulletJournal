import React, {useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import {connect} from "react-redux";
import {getStep, deleteStep} from "../../features/templates/actions";
import {IState} from "../../store";
import {Step} from "../../features/templates/interface";
import {BackTop, Divider, Tooltip, Typography} from "antd";
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
}

const AdminStepPage: React.FC<AdminStepProps> = (
    {step, getStep, deleteStep}) => {
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

    const removeStep = (step: Step, id: number) => {

    }

    const addStep = (step: Step, id: number) => {

    }

    return <div className='steps-page'>
        <BackTop/>
        <div><DeleteFilled onClick={handleDelete}/></div>
        <h2>{step.name}</h2>
        <div></div>
        <Divider/>
        <h3>Choices</h3>
        {step.choices.map(c => {
            return <div>
                <AdminChoiceElem choice={c} />
                {' '}
                <Tooltip title='Remove Choice'>
                    <DeleteTwoTone style={{cursor: 'pointer'}} onClick={() => removeStep(step, c.id)}/>
                </Tooltip>
            </div>
        })}
        <Divider/>
        <div>
            <h3>Available Choices to add</h3>
            <AdminChoices
                showAddChoice={true}
                addChoice={(id) => addStep(step, id)}
                choicesToExclude={step.choices.map(c => c.id)}/>
        </div>
        <Container>
            <AddRule step={step}/>
        </Container>
    </div>
}

const mapStateToProps = (state: IState) => ({
    step: state.templates.step,
});

export default connect(mapStateToProps, {
    getStep, deleteStep
})(AdminStepPage);