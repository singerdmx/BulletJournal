import React, {useEffect, useState} from 'react';
import './workflow.styles.less';
import {Button, Checkbox, Collapse, Divider, Input, message, Tag, Tooltip} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getSampleTasks, getSteps, setSampleTaskRule} from "../../features/templates/actions";
import {SampleTask, Selection, Step} from "../../features/templates/interface";
import Search from "antd/es/input/Search";
import {CheckCircleTwoTone, CheckSquareTwoTone, CloseCircleTwoTone, FilterOutlined} from "@ant-design/icons";
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
    setSampleTaskRule: (stepId: number, selectionCombo: string, taskIds: string) => void;
};

const AdminWorkflowTasks: React.FC<WorkflowPageProps> = (
    {
        steps,
        sampleTasks,
        getSteps,
        getSampleTasks,
        setSampleTaskRule
    }) => {
    const history = useHistory();

    useEffect(() => {
        getSteps();
    }, []);
    const [targetFinalStep, setTargetFinalStep] = useState<Step | undefined>(undefined);
    const [targetChoiceStep, setTargetChoiceStep] = useState<Step | undefined>(undefined);
    const [targetSelections, setTargetSelections] = useState<Selection[]>([]);
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
        setChecked([]);
        getSampleTasks(value);
    }

    const onFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const s = e.target.value;
        setChecked([]);
        if (!s) {
            setTasks(sampleTasks);
            return;
        }
        setTasks(sampleTasks.filter(t => t.metadata.toLowerCase().includes(s.toLowerCase())));
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

        if (!targetFinalStep) {
            message.error('No targetFinalStep selected');
            return;
        }

        if (targetSelections.length === 0) {
            message.error('No target Selections selected');
            return;
        }

        console.log(targetSelections.toString());
        setSampleTaskRule(targetFinalStep.id, targetSelections.map(s => s.id).join(','), checked.join(','));
        setChecked([]);
        message.success('Successfully linked');
    }

    const onClickSelection = (selection: Selection) => {
        if (targetSelections.map(s => s.id).includes(selection.id)) {
            setTargetSelections(targetSelections.filter(s => s.id !== selection.id));
            return;
        }

        setTargetSelections(targetSelections.concat([selection]));
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
                            <Tooltip title='Select Target Final Step'>
                                <CheckCircleTwoTone onClick={() => setTargetFinalStep(s)}/>
                            </Tooltip>
                            <Tooltip title='Select Target Choice Step'>
                                <CheckSquareTwoTone
                                    onClick={() => {
                                    setTargetSelections([]);
                                    setSelectionFilter('');
                                    setTargetChoiceStep(s);
                                }}/>
                            </Tooltip>
                        </div>

                    );
                })}
            </div>
            <Divider/>
            <div>
                <div>
                    <b>Target Final Step:</b> {targetFinalStep ? targetFinalStep.name : 'None'}
                    {'   '}
                    <b>Target
                        Selection:</b> {targetSelections.length > 0 ? targetSelections.map(s => s.text).join(', ') : 'None'}
                    {' '}
                    {targetFinalStep && targetSelections.length > 0 &&
                    <Button type='primary' onClick={() => linkTasks()}>
                        Link Tasks to Selection
                    </Button>}
                </div>
                {targetChoiceStep && <div>
                    <Divider/>
                    <h3>{targetChoiceStep ? `Step ${targetChoiceStep.name} Choices` : 'Choices'}</h3>
                    <Input onChange={(e) => onFilterSelection(e)}
                           style={{width: '40%', padding: '5px', margin: '5px'}} placeholder="Filter Selection"
                           prefix={<FilterOutlined/>}></Input>
                    <Collapse defaultActiveKey={[]}>
                        {
                            targetChoiceStep && targetChoiceStep.choices.map((choice, i) => {
                                return <Panel header={choice.name} key={i}>
                                    {choice.selections.filter((s) => !selectionFilter || isSubsequence(s.text, selectionFilter))
                                        .map(selection => {
                                            return <span style={{cursor: 'pointer'}}
                                                         onClick={() => onClickSelection(selection)}>
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
                                        &nbsp;({sampleTask.id})
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
    getSampleTasks,
    setSampleTaskRule
})(AdminWorkflowTasks);
