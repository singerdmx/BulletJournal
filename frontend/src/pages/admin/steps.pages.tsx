import React, {useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import {connect} from "react-redux";
import {getCategory, getSteps, deleteStep, cloneStep} from "../../features/templates/actions";
import {IState} from "../../store";
import {Category, Step} from "../../features/templates/interface";
import {BackTop, Typography} from "antd";
import './steps.styles.less'
import {Container} from "react-floating-action-button";
import AddStep from "../../components/modals/templates/add-step.component";

const {Title, Text} = Typography;

type AdminStepsProps = {
    category: Category | undefined;
    steps: Step[];
    getCategory: (categoryId: number) => void;
    getSteps: () => void;
    deleteStep: (stepId: number) => void;
    cloneStep: (stepId: number) => void;
}

const AdminStepsPage: React.FC<AdminStepsProps> = (
    {category, steps, getCategory, getSteps, deleteStep, cloneStep}) => {
    const history = useHistory();
    const {categoryId} = useParams();

    useEffect(() => {
        if (categoryId) {
            getCategory(parseInt(categoryId));
        }
        getSteps();
    }, [categoryId]);

    if (!category) {
        return <div>{categoryId} Not Found</div>
    }

    return <div className='steps-page'>
        <BackTop/>
        <h2>{category.name}</h2>
        <div>
            {steps.map((s) => {
                return (
                    <div>
                        <span style={{cursor: 'pointer', padding: '5px'}}
                              onClick={() => history.push(`/admin/steps/${s.id}`)}>{s.name} ({s.id}) 
                        </span>
                        <button onClick={() => deleteStep(s.id)}>Delete Step</button>
                        <button onClick={() => cloneStep(s.id)}>Clone Step</button>
                    </div>
                    
                );
            })}
        </div>
        <Container>
            <AddStep/>
        </Container>
    </div>
}

const mapStateToProps = (state: IState) => ({
    steps: state.templates.steps,
    category: state.templates.category
});

export default connect(mapStateToProps, {
    getCategory, getSteps, deleteStep, cloneStep
})(AdminStepsPage);