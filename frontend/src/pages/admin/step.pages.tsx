import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {connect} from "react-redux";
import {getStep} from "../../features/templates/actions";
import {IState} from "../../store";
import {Step} from "../../features/templates/interface";
import {BackTop, Typography} from "antd";
import './steps.styles.less'

const {Title, Text} = Typography;

type AdminStepProps = {
    step: Step | undefined;
    getStep: (stepId: number) => void;
}

const AdminStepPage: React.FC<AdminStepProps> = (
    {step, getStep}) => {

    const {stepId} = useParams();

    useEffect(() => {
        if (stepId) {
            getStep(parseInt(stepId));
        }
    }, [stepId]);

    if (!step) {
        return <div>{stepId} Not Found</div>
    }

    return <div className='steps-page'>
        <BackTop/>
        <h2>{step.name}</h2>
        <div>
        </div>
    </div>
}

const mapStateToProps = (state: IState) => ({
    step: state.templates.step,
});

export default connect(mapStateToProps, {
    getStep
})(AdminStepPage);