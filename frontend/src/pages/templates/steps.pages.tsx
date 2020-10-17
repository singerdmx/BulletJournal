import React, {useEffect, useState} from 'react';
import './steps.styles.less';
import {useParams} from "react-router-dom";
import {IState} from "../../store";
import {connect} from "react-redux";
import {
    getCategory,
    getNextStep,
    getSampleTasksByScrollId,
    nextStepReceived,
    sampleTasksReceived
} from "../../features/templates/actions";
import {Category, Choice, NextStep, SampleTask, SampleTasks, Step} from "../../features/templates/interface";
import {Button, Card, Empty, message, notification, Select, Tooltip} from "antd";
import {isSubsequence} from "../../utils/Util";
import {
    CloseOutlined,
    CloseSquareTwoTone,
    ExclamationCircleFilled,
    QuestionCircleTwoTone,
    UpCircleTwoTone
} from "@ant-design/icons";
import ReactLoading from "react-loading";
import {getCookie} from "../../index";
import StepsImportTasksPage from "./steps.import.tasks.pages";
import {updateProjects} from "../../features/project/actions";
import {updateExpandedMyself} from "../../features/myself/actions";
import Feedback from "./feedback.page";

const {Meta} = Card;
const {Option} = Select;

type StepsProps = {
    reload: boolean;
    loadingNextStep: boolean;
    sampleTasks: SampleTask[];
    scrollId: string;
    category: Category | undefined;
    nextStep: NextStep | undefined;
    updateProjects: () => void;
    getCategory: (categoryId: number) => void;
    getNextStep: (stepId: number, selections: number[], prevSelections: number[], first?: boolean) => void;
    nextStepReceived: (nextStep: NextStep | undefined) => void;
    sampleTasksReceived: (sampleTasks: SampleTask[], scrollId: string) => void;
    getSampleTasksByScrollId: (scrollId: string, pageSize: number) => void;
    updateExpandedMyself: (updateSettings: boolean) => void;
};

export const STEPS = 'steps';
export const SELECTIONS = 'selections';
export const SAMPLE_TASKS = 'sampleTasks';

export const getSelections = () => {
    const selectionsText = localStorage.getItem(SELECTIONS);
    const selections: any = selectionsText ? JSON.parse(selectionsText) : {};
    return selections;
}

export const isMobile = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return userAgent.includes('mobile');
}

const StepsPage: React.FC<StepsProps> = (
    {
        reload, loadingNextStep, sampleTasks, category, scrollId,
        nextStep, getCategory, getNextStep, nextStepReceived, sampleTasksReceived,
        updateProjects, updateExpandedMyself, getSampleTasksByScrollId,
    }
) => {
    const {categoryId} = useParams();

    useEffect(() => {
        if (categoryId) {
            getCategory(parseInt(categoryId));
            const loginCookie = getCookie('__discourse_proxy');
            if (loginCookie) {
                updateExpandedMyself(true);
            }
        }
    }, [categoryId]);

    useEffect(() => {
        if (reload) {
            localStorage.removeItem(STEPS);
            localStorage.removeItem(SELECTIONS);
            localStorage.removeItem(SAMPLE_TASKS);
            window.location.reload();
        }
    }, [reload]);

    useEffect(() => {
        document.title = 'Bullet Journal - Steps';
        if (category) {
            document.title = category.name;
            const existingSteps = getSteps();
            if (existingSteps.length > 0 && existingSteps[0].id !== category.id) {
                localStorage.removeItem(STEPS);
                localStorage.removeItem(SELECTIONS);
                localStorage.removeItem(SAMPLE_TASKS);
                sampleTasksReceived([], '');
            } else {
                const selections = getSelections();
                const curStep = getCurrentStep();
                if (curStep) {
                    setShowConfirmButton(curStep.choices.every(c => selections[c.id] && selections[c.id].length > 0));
                }
            }
        }
    }, [category]);

    useEffect(() => {
        if (nextStep && nextStep.step) {
            const steps = getSteps();
            steps.push(nextStep.step);
            localStorage.setItem(STEPS, JSON.stringify(steps));
            if (nextStep.step.choices.length === 0) {
                setShowConfirmButton(false);
            }
        }
    }, [nextStep]);

    const [curSelections, setCurSelections] = useState<any>({});
    const [showConfirmButton, setShowConfirmButton] = useState(false);
    const [showImportTasksCard, setShowImportTasksCard] = useState(false);
    const [showApplyButton, setShowApplyButton] = useState(true);
    const [showFeedbackCard, setShowFeedbackCard] = useState(false);

    if (!category) {
        return <Empty/>
    }

    const getComingSoonDiv = () => {
        if (!category) {
            return null;
        }
        if ((nextStep && nextStep.step === null) || (category.choices.length === 0)) {
            return <div className='coming-soon'>
                <img alt='Coming Soon'
                     src='https://user-images.githubusercontent.com/122956/92905797-d299c600-f3d8-11ea-813a-3ac75c2f5677.gif'/>
            </div>
        }
        return null;
    }

    const getSteps = () => {
        const steps: Step[] = JSON.parse(localStorage.getItem(STEPS) || '[]');
        return steps;
    }

    const getCurrentStep = () => {
        if (nextStep && nextStep.step) {
            return nextStep.step;
        }
        const steps = getSteps();
        return steps[steps.length - 1];
    }

    const setSelections = (selections: any) => {
        setCurSelections(selections);
        localStorage.setItem(SELECTIONS, JSON.stringify(selections));
    }

    const onChoiceChange = (e: any, choice: Choice) => {
        const selections = getSelections();
        selections[choice.id] = e ? (Array.isArray(e) ? e : [e]) : null;
        setSelections(selections);

        const curStep = getCurrentStep();
        setShowConfirmButton(curStep.choices.every(c => selections[c.id] && selections[c.id].length > 0));
    }

    const onFilterChoices = (inputValue: string, option: any) => {
        inputValue = inputValue.toLowerCase();
        return isSubsequence(option.key.toString().toLowerCase(), inputValue);
    };

    const selectAll = (choice: Choice) => {
        const curStep = getCurrentStep();
        const selections = getSelections();
        selections[choice.id] = curStep.choices.filter(c => c.id === choice.id)[0].selections
            .filter(selection => !curStep.excludedSelections.includes(selection.id)).map(s => s.id);
        setSelections(selections);
        setShowConfirmButton(curStep.choices.every(c => selections[c.id] && selections[c.id].length > 0));
    }

    const getChoiceValue = (choice: Choice) => {
        if (curSelections[choice.id]) {
            return curSelections[choice.id];
        }
        const selections = getSelections();
        if (selections[choice.id]) {
            return selections[choice.id];
        }

        return [];
    }

    const renderChoice = (choice: Choice) => {
        const curStep = getCurrentStep();
        return <div key={choice.id} className='choice-card'>
            <Select mode={choice.multiple ? 'multiple' : undefined}
                    clearIcon={<CloseSquareTwoTone/>}
                    showSearch={true}
                    filterOption={(e, t) => onFilterChoices(e, t)}
                    onChange={(e) => onChoiceChange(e, choice)}
                    placeholder={choice.name}
                    value={getChoiceValue(choice)}
                    style={{padding: '3px', minWidth: choice.multiple ? '50%' : '25%'}}
                    allowClear>
                {choice.selections.filter(selection => !curStep.excludedSelections.includes(selection.id))
                    .map(selection => {
                        return <Option key={selection.text} value={selection.id}>{selection.text}</Option>
                    })}
            </Select>
            {choice.multiple && <Button
                onClick={() => selectAll(choice)}
                style={{color: '#4ddbff'}} shape="round" size='small'>
                All
            </Button>}
        </div>
    }

    const goBack = () => {
        setShowConfirmButton(false);
        setShowImportTasksCard(false);
        setShowApplyButton(true);
        const steps: Step[] = getSteps();
        const selections = getSelections();
        steps[steps.length - 1].choices.forEach(c => {
            selections[c.id] = null;
        });
        steps.pop();
        if (steps[steps.length - 1]) {
            steps[steps.length - 1].choices.forEach(c => {
                selections[c.id] = null;
            });
        }
        setSelections(selections);
        localStorage.setItem(STEPS, JSON.stringify(steps));
        nextStepReceived(undefined);
        sampleTasksReceived([], '');
        localStorage.removeItem(SAMPLE_TASKS);
    }

    const onConfirmNext = () => {
        const selections = getSelections();
        const curStep = getCurrentStep();
        if (!curStep.choices.every(c => selections[c.id] && selections[c.id].length > 0)) {
            notification.open({
                placement: 'bottomRight',
                message: 'Make Selection',
                description: 'Please make sure there is no missing place',
                icon: <ExclamationCircleFilled style={{ color: 'red' }} />,
            });
            return;
        }
        let selected: number[] = [];
        curStep.choices.forEach(c => {
            selected = selected.concat(selections[c.id]);
        });

        let prevSelections = [] as number[];

        Object.keys(selections).forEach((k) => {
            if (!curStep.choices.map(c => c.id).includes(parseInt(k)) && selections[k]) {
                prevSelections = prevSelections.concat(selections[k]);
            }
        });
        getNextStep(curStep.id, selected, prevSelections, getSteps().length === 1);
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 300);
    }

    const onScrollNext = () => {
        getSampleTasksByScrollId(scrollId, isMobile() ? 10 : 20);
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 300);
    }

    const onApplySampleTasks = () => {
        setShowImportTasksCard(true);
        const loginCookie = getCookie('__discourse_proxy');
        if (loginCookie) {
            updateProjects();
            setShowApplyButton(false);
        }
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 100);
    }

    const getSampleTasks = () => {
        if (sampleTasks && sampleTasks.length > 0) {
            return sampleTasks;
        }

        const sampleTasksText = localStorage.getItem(SAMPLE_TASKS);
        if (sampleTasksText) {
            const data: SampleTasks = JSON.parse(sampleTasksText);
            if (data.sampleTasks && data.sampleTasks.length > 0) {
                sampleTasksReceived(data.sampleTasks, data.scrollId ? data.scrollId : '');
            }
            return data.sampleTasks;
        }

        return [];
    }

    const onRemoveTask = (e: React.MouseEvent<HTMLElement>, id: number) => {
        e.preventDefault();
        e.stopPropagation();
        const data = sampleTasks.filter(t => t.id !== id);
        sampleTasksReceived(data, scrollId);
        localStorage.setItem(SAMPLE_TASKS, JSON.stringify({
            sampleTasks: data,
            scrollId: scrollId
        }));
    }

    const getStepsDiv = () => {
        if (!category || category.choices.length === 0) {
            return null;
        }

        const existingSteps = getSteps();
        if (existingSteps.length > 0) {
            const curStep = getCurrentStep();
            const tasks = getSampleTasks();
            return <div>
                <div className='choices-card'>
                    {((nextStep && nextStep.step) || existingSteps.length > 1) && <div className='go-back'>
                        <Button
                            onClick={goBack}
                            style={{color: '#4ddbff'}} shape="round"
                            icon={<UpCircleTwoTone/>}>
                            Go Back
                        </Button>
                    </div>}
                    <div>
                        {curStep.choices.map(choice => {
                            return renderChoice(choice);
                        })}
                    </div>
                    {tasks.length > 0 && <div className='sample-tasks'>
                        {tasks.map((sampleTask: SampleTask) => {
                            return <div className='sample-task' onClick={() => window.location.href = `${window.location.protocol}//${window.location.host}/public/sampleTasks/${sampleTask.id}`}>
                                <div className='remove-task-icon'>
                                    <Tooltip title='Remove this'>
                                        <CloseOutlined onClick={(e) => onRemoveTask(e, sampleTask.id)}/>
                                    </Tooltip>
                                </div>
                                {sampleTask.name}
                            </div>
                        })}
                    </div>}
                    <div className='confirm-button'>
                        {(isMobile() || showConfirmButton) && curStep.choices.length > 0 && <Button
                            onClick={onConfirmNext}
                            style={{color: '#4ddbff', margin: '3px'}} shape="round">
                            Next
                        </Button>}
                        {scrollId && <Button
                            onClick={onScrollNext}
                            style={{color: '#4ddbff', margin: '3px'}} shape="round">
                            More
                        </Button>}
                        {tasks.length > 0 && showApplyButton && <Button
                            onClick={onApplySampleTasks}
                            style={{color: '#4ddbff', margin: '3px'}} shape="round">
                            Apply
                        </Button>}
                    </div>
                    <div className='confirm-button'>
                        {loadingNextStep && <ReactLoading type="bubbles" color="#0984e3"/>}
                    </div>
                </div>
                {showImportTasksCard && <>
                    <div className='import-card'>
                        <StepsImportTasksPage hideImportTasksCard={() => {
                            setShowImportTasksCard(false);
                            setShowApplyButton(true);
                        }}/>
                    </div>
                </>
                }
            </div>
        }

        const steps: Step[] = [{...category, excludedSelections: []}];
        localStorage.setItem(STEPS, JSON.stringify(steps));
        return <div className='choices-card'>
            {category.choices.map(choice => {
                return renderChoice(choice);
            })}
        </div>
    }

    return (
        <div className='steps-page'>
            <div className='steps-info'>
                <Card
                    className='category'
                    style={{backgroundColor: `${category.color}`}}
                    cover={
                        <img alt={category.name} src={category.image}/>
                    }
                >
                    <Meta
                        title={<span>
                            {category.name}&nbsp;
                            {category.forumId && <Tooltip title='Contact us with suggestion or feedback. Your valuable input will be awarded with points.'>
                                <QuestionCircleTwoTone style={{cursor: "pointer"}} onClick={() => {
                                    const loginCookie = getCookie('__discourse_proxy');
                                    if (!loginCookie) {
                                        message.warn("You need to login in order to submit feedback");
                                        setShowFeedbackCard(false);
                                        return;
                                    }
                                    setShowFeedbackCard(true);
                                }}/>
                            </Tooltip>}
                        </span>}
                        description={category.description}
                    />
                </Card>
            </div>
            {showFeedbackCard && category.forumId && <div className='feedback-card'>
               <Feedback forumId={category.forumId} hideShowFeedbackCard={() => setShowFeedbackCard(false)}/>
            </div>}
            {getStepsDiv()}
            {getComingSoonDiv()}
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    reload: state.myself.reload,
    category: state.templates.category,
    nextStep: state.templates.nextStep,
    sampleTasks: state.templates.sampleTasks,
    scrollId: state.templates.scrollId,
    loadingNextStep: state.templates.loadingNextStep,
});

export default connect(mapStateToProps, {
    getCategory,
    getNextStep,
    nextStepReceived,
    updateProjects,
    updateExpandedMyself,
    sampleTasksReceived,
    getSampleTasksByScrollId,
})(StepsPage);
