import React, {useEffect, useState} from 'react';
import './workflow.styles.less';
import {Divider, Input, message} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getSampleTasks, getSteps} from "../../features/templates/actions";
import {SampleTask, Step} from "../../features/templates/interface";
import Search from "antd/es/input/Search";
import {CheckCircleTwoTone, FilterOutlined} from "@ant-design/icons";
import {useHistory} from "react-router-dom";

type WorkflowPageProps = {
    steps: Step[];
    sampleTasks: SampleTask[];
    getSteps: () => void;
    getSampleTasks: (filter: string) => void;
};

const AdminWorkflowTasks: React.FC<WorkflowPageProps> = (
    {
        steps,
        sampleTasks,
        getSteps,
        getSampleTasks
    }) => {
    const history = useHistory();

    useEffect(() => {
        getSteps();
    }, []);
    const [targetStep, setTargetStep] = useState<Step | undefined>(undefined);

    const searchTasks = (value: string) => {
        if (!value) {
            message.error('Input is empty');
            return;
        }

        getSampleTasks(value);
    }

    return (
        <div>
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
                            onSearch={value => searchTasks(value)} enterButton/>
                    <Input style={{width: '40%', padding: '5px', margin: '5px'}} placeholder="Filter"
                           prefix={<FilterOutlined/>}/>
                    <div>
                        {sampleTasks.map(sampleTask => {
                            return <div>{sampleTask.name}</div>
                        })}
                    </div>
                </div>
            </div>

        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    steps: state.templates.steps,
    sampleTasks: state.templates.sampleTasks
});

export default connect(mapStateToProps, {
    getSteps,
    getSampleTasks
})(AdminWorkflowTasks);
