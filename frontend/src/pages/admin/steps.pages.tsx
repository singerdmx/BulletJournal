import React, {useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import {connect} from "react-redux";
import {cloneStep, deleteStep, getCategory, getSteps} from "../../features/templates/actions";
import {IState} from "../../store";
import {Category, Step} from "../../features/templates/interface";
import {BackTop, Divider, Empty} from "antd";
import './steps.styles.less'
import {Container} from "react-floating-action-button";
import AddStep from "../../components/modals/templates/add-step.component";
import {getCategorySteps} from "../../features/admin/actions";
import {CategorySteps, SampleTaskRule} from "../../features/admin/interface";
import {ArrowRightOutlined} from "@ant-design/icons";

type AdminStepsProps = {
    category: Category | undefined;
    steps: Step[];
    categorySteps: CategorySteps | undefined;
    getCategory: (categoryId: number) => void;
    getSteps: () => void;
    deleteStep: (stepId: number) => void;
    cloneStep: (stepId: number) => void;
    getCategorySteps: (categoryId: number) => void;
}

const AdminStepsPage: React.FC<AdminStepsProps> = (
    {category, categorySteps, steps, getCategory, getSteps, deleteStep, cloneStep, getCategorySteps}) => {
    const history = useHistory();
    const {categoryId} = useParams();

    useEffect(() => {
        if (categoryId) {
            getCategory(parseInt(categoryId));
            getCategorySteps(parseInt(categoryId));
        }
        getSteps();
    }, [categoryId]);

    if (!category || !categorySteps) {
        return <div>{categoryId} Not Found</div>
    }

    console.log(categorySteps.finalSteps)
    return <div className='steps-page'>
        <BackTop/>
        <h2>{category.name}</h2>
        <div>
            {categorySteps.connections.map(connection => {
                return <div>
                    <span>{connection.left.name} ({connection.left.id})</span>
                    <ArrowRightOutlined />
                    {connection.middle && <span>{connection.middle.name} ({connection.middle.id})</span>}
                    <ArrowRightOutlined />
                    <span style={{cursor: 'pointer'}} onClick={() => history.push(`/admin/steps/${connection.right.id}`)}>
                        {connection.right.name} ({connection.right.id})
                    </span>
                </div>
            })}
        </div>
        <Divider/>
        <h4>Final Steps</h4>
        {categorySteps.finalSteps.length === 0 ? <Empty/> : (<div>
            {categorySteps.finalSteps.map((sampleTaskRule: SampleTaskRule) => {
                return <div>
                    <div>
                    <span style={{cursor: 'pointer', padding: '5px'}}
                          onClick={() => history.push(`/admin/steps/${sampleTaskRule.step.id}`)}>
                        <b>{sampleTaskRule.step.name}</b> ({sampleTaskRule.step.id})
                    </span> <b>Selections {sampleTaskRule.selectionCombo}</b>: {sampleTaskRule.selections.map(s => {
                        return <span>{s.text} ({s.id}){' '}</span>
                    })}
                    </div>
                    <div>
                        {sampleTaskRule.tasks.map(s => {
                            return <span><span
                                style={{cursor: 'pointer', backgroundColor: '#ffb3cc'}}
                                onClick={() => history.push(`/admin/sampleTasks/${s.id}`)}>{s.name}</span>
                                ({s.id}){' '}</span>
                        })}
                    </div>
                </div>
            })}
        </div>)}
        <Divider/>
        <div>
            {steps.filter(step => !categorySteps!.stepIds.includes(step.id)).map((s) => {
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
    category: state.templates.category,
    categorySteps: state.admin.categorySteps
});

export default connect(mapStateToProps, {
    getCategory, getSteps, deleteStep, cloneStep, getCategorySteps
})(AdminStepsPage);