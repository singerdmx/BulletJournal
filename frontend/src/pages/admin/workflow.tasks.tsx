import React, {useEffect, useState} from 'react';
import './workflow.styles.less';
import {Button, Checkbox, Collapse, Divider, Input, message, Tag, Tooltip} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getSampleTasks, getSteps} from "../../features/templates/actions";
import {SampleTask, Selection, Step} from "../../features/templates/interface";
import Search from "antd/es/input/Search";
import {CheckCircleTwoTone, CloseCircleTwoTone, FilterOutlined} from "@ant-design/icons";
import {useHistory} from "react-router-dom";
import {Container} from "react-floating-action-button";
import AddSampleTask from "../../components/modals/templates/add-sample-task.component";
import {isSubsequence} from "../../utils/Util";

const {Panel} = Collapse;

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
    const [targetSelection, setTargetSelection] = useState<Selection | undefined>(undefined);
    const [tasks, setTasks] = useState<SampleTask[]>([]);
    const [checked, setChecked] = useState([] as number[]);
    const [selectionFilter, setSelectionFilter] = useState('');

    useEffect(() => {
        setTasks(sampleTasks);
    }, [sampleTasks]);

    const searchTasks = (value: string) => {
        if (!value) {
            message.error('Input is empty');
            return;
        }

        getSampleTasks(value);
    }

    const onFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const s = e.target.value;
        console.log(s);
        if (!s) {
            setTasks(sampleTasks);
            return;
        }
        setTasks(tasks.filter(t => isSubsequence(t.metadata, s)));
    }

    const onFilterSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        const s = e.target.value;
        console.log(s);
        setSelectionFilter(s);
    }

    const onCheckBoxChange = (id: number) => {
        if (checked.includes(id)) {
            setChecked(checked.filter((c) => c !== id));
            return;
        }

        setChecked(checked.concat([id]));
    }

    const selectAllTasks = () => {
        setChecked(tasks.map(t => t.id));
    }

    const linkTasks = () => {
        if (checked.length === 0) {
            message.error('No task selected');
            return;
        }

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
                    {'   '}
                    <b>Target Selection:</b> {targetSelection ? targetSelection.text : 'None'}
                    {' '}
                    {targetStep && targetSelection && <Button type='primary' onClick={() => linkTasks()}>
                        Link Tasks to Selection
                    </Button>}
                </div>
                {targetStep && <div>
                    <Divider/>
                    <h3>Choices</h3>
                    <Input onChange={(e) => onFilterSelection(e)}
                           style={{width: '40%', padding: '5px', margin: '5px'}} placeholder="Filter Selection"
                           prefix={<FilterOutlined/>}></Input>
                    <Collapse defaultActiveKey={[]}>
                        {
                            targetStep.choices.map((choice, i) => {
                                return <Panel header={choice.name} key={i}>
                                    {choice.selections.filter((s) => !selectionFilter || isSubsequence(s.text, selectionFilter))
                                        .map(selection => {
                                            return <span style={{cursor: 'pointer'}}
                                                         onClick={() => setTargetSelection(selection)}>
                                            {selection.text} ({selection.id}){'  '}
                                        </span>
                                        })}
                                </Panel>
                            })
                        }
                    </Collapse>
                </div>}
                <Divider/>
                <h3>Tasks</h3>
                <div>
                    <Search style={{width: '40%', padding: '5px'}} placeholder="Search Sample Tasks"
                            onSearch={value => searchTasks(value)} enterButton/>
                    <Input onChange={(e) => onFilterChange(e)}
                           style={{width: '40%', padding: '5px', margin: '5px'}} placeholder="Filter Tasks"
                           prefix={<FilterOutlined/>}/>
                    {tasks.length > 0 && <span>
                        <Tooltip title='Select All Tasks'>
                            <CheckCircleTwoTone onClick={() => selectAllTasks()}/>
                        </Tooltip>
                        <Tooltip title='Deselect All Tasks'>
                            <CloseCircleTwoTone onClick={() => setChecked([])}/>
                        </Tooltip>
                    </span>}
                    <div>
                        {tasks.map(sampleTask => {
                            return <div style={{cursor: 'pointer'}}>
                                <Checkbox checked={checked.includes(sampleTask.id)}
                                          onChange={() => onCheckBoxChange(sampleTask.id)}>
                                    <span onClick={() => history.push(`/admin/sampleTasks/${sampleTask.id}`)}>
                                        <b>{sampleTask.name}</b>{' '}
                                        <Tag>{sampleTask.metadata}</Tag>
                                    </span>
                                </Checkbox>
                            </div>
                        })}
                    </div>
                </div>
            </div>
            <Container>
                <AddSampleTask/>
            </Container>
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
