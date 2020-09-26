import React, {useEffect, useState} from 'react';
import './steps.styles.less';
import {useHistory} from "react-router-dom";
import {IState} from "../../store";
import {connect} from "react-redux";
import {Avatar, Button, Checkbox, DatePicker, notification, Result, Select, Tooltip} from "antd";
import {Project, ProjectsWithOwner} from "../../features/project/interface";
import {flattenOwnedProject, flattenSharedProject} from "../projects/projects.pages";
import {ProjectType} from "../../features/project/constants";
import AddProject from "../../components/modals/add-project.component";
import {iconMapper} from "../../components/side-menu/side-menu.component";
import {getCookie} from "../../index";
import {Group} from "../../features/group/interface";
import {getGroup} from "../../features/group/actions";
import {onFilterAssignees, onFilterLabel} from "../../utils/Util";
import {labelsUpdate} from "../../features/label/actions";
import {Label} from "../../features/label/interface";
import {getIcon} from "../../components/draggable-labels/draggable-label-list.component";
import {ReminderBeforeTaskText} from "../../components/settings/reducer";
import {QuestionCircleTwoTone, SmileOutlined} from "@ant-design/icons";
import {Category, SampleTask, SampleTasks} from "../../features/templates/interface";
import {zones} from "../../components/settings/constants";
import {importTasks, sampleTasksReceived} from "../../features/templates/actions";
import {getSelections, isMobile, SAMPLE_TASKS} from "./steps.pages";
import ReactLoading from "react-loading";

const {Option} = Select;

type StepsImportTasksProps = {
    loadingNextStep: boolean;
    myself: string;
    timezone: string;
    labelOptions: Label[];
    before: number;
    category: Category | undefined;
    ownedProjects: Project[];
    sharedProjects: ProjectsWithOwner[];
    sampleTasks: SampleTask[];
    group: Group | undefined;
    getGroup: (groupId: number) => void;
    labelsUpdate: (projectId: number | undefined) => void;
    sampleTasksReceived: (sampleTasks: SampleTask[], scrollId: string) => void;
    hideImportTasksCard: () => void;
    importTasks: (postOp: Function, timeoutOp: Function,
                  sampleTasks: number[], selections: number[], categoryId: number,
                  projectId: number, assignees: string[],
                  reminderBefore: number, labels: number[], subscribed: boolean,
                  startDate?: string, timezone?: string) => void;
};

const StepsImportTasksPage: React.FC<StepsImportTasksProps> = (
    {
        loadingNextStep, myself, labelOptions, ownedProjects, sharedProjects, group,
        sampleTasks, timezone, category, before, getGroup, labelsUpdate,
        importTasks, hideImportTasksCard, sampleTasksReceived
    }
) => {
    const history = useHistory();
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectId, setProjectId] = useState(-1);
    const [assignees, setAssignees] = useState<string[]>([]);
    const [labels, setLabels] = useState<number[]>([]);
    const [startDate, setStartDate] = useState<string>('');
    const [targetTimezone, setTargetTimezone] = useState(timezone);
    const [reminderBefore, setReminderBefore] = useState<number | undefined>(before);
    const [subscribed, setSubscribed] = useState(true);

    const reset = (project: Project) => {
        setProjectId(project.id);
        getGroup(project.group.id);
        labelsUpdate(project.id);
        setAssignees([myself]);
        setTargetTimezone(timezone);
        setReminderBefore(before);
        setSubscribed(true);
        setLabels([]);
    }

    useEffect(() => {
        setAssignees([myself]);
    }, [myself]);

    useEffect(() => {
        setTargetTimezone(timezone);
    }, [timezone]);

    useEffect(() => {
        setReminderBefore(before);
    }, [before]);

    useEffect(() => {
        if (projects && projects[0]) {
            reset(projects[0]);
        } else {
            setProjectId(-1);
        }
    }, [projects]);

    useEffect(() => {
        setProjects([]);
        setProjects(flattenOwnedProject(ownedProjects, projects));
        setProjects(flattenSharedProject(sharedProjects, projects));
        setProjects(
            projects.filter((p) => {
                return p.projectType === ProjectType.TODO && !p.shared;
            })
        );
    }, [ownedProjects, sharedProjects]);

    const onGoSignIn = () => {
        window.location.href = 'https://bulletjournal.us/sso_login' + window.location.pathname +
            window.location.search + window.location.hash;
    }

    const onChangeAssignees = (value: any) => {
        setAssignees(value);
    }

    const onChangeLabels = (value: any) => {
        setLabels(value);
    }

    const onChangeReminderBefore = (value: any) => {
        setReminderBefore(value);
    }

    const onChangeStartDate = (date: any, dateString: any) => {
        console.log(dateString);
        setStartDate(dateString);
    }

    const onChangeTimezone = (value: any) => {
        console.log(value);
        setTargetTimezone(value);
    }

    const onChangeSubscribed = (value: any) => {
        setSubscribed(value.target.checked);
    }

    const getSampleTasks = () => {
        if (sampleTasks && sampleTasks.length > 0) {
            return sampleTasks;
        }

        const sampleTasksText = localStorage.getItem(SAMPLE_TASKS);
        if (sampleTasksText) {
            const data: SampleTasks = JSON.parse(sampleTasksText);
            sampleTasksReceived(data.sampleTasks, data.scrollId);
            return data.sampleTasks;
        }

        return [];
    }

    const onClickImport = () => {
        const selections = getSelections();
        let curSelections = [] as number[];

        Object.keys(selections).forEach((k) => {
            curSelections = curSelections.concat(selections[k]);
        });

        if (category) {
            importTasks(() => {
                    notification.open({
                        placement: 'bottomRight',
                        message: 'Events successfully imported',
                        description: 'Please go to your BuJo to view them',
                        icon: <SmileOutlined style={{ color: '#4ddbff' }} />,
                    });
                    if (isMobile()) {
                        hideImportTasksCard();
                    } else {
                        setTimeout(() => {
                            window.location.href = `${window.location.protocol}//${window.location.host}/#/projects/${projectId}`;
                        }, 5000);
                    }
                },
                () => {
                    notification.open({
                        placement: 'bottomRight',
                        message: 'We are still working on importing these events',
                        description: 'Please go to your BuJo later to view them',
                        icon: <SmileOutlined style={{color: '#4ddbff'}}/>,
                    });
                    if (isMobile()) {
                        setTimeout(() => {
                            window.location.href = `${window.location.protocol}//${window.location.host}/public/templates`;
                        }, 5000);
                    } else {
                        setTimeout(() => {
                            window.location.href = `${window.location.protocol}//${window.location.host}/#/projects/${projectId}`;
                        }, 5000);
                    }
                },
                getSampleTasks().map(s => s.id), curSelections, category.id,
                projectId, assignees,
                reminderBefore === undefined ? before : reminderBefore, labels, subscribed,
                startDate, targetTimezone ? targetTimezone : timezone);
        }
        window.scrollTo(0, document.body.scrollHeight);
    }

    const getUserSelections = () => {
        if (!group || !group.users) {
            return null;
        }
        return (
            <>
                <Select
                    mode="multiple"
                    allowClear={true}
                    onChange={onChangeAssignees}
                    filterOption={(e, t) => onFilterAssignees(e, t)}
                    value={assignees}
                    style={{padding: '3px', minWidth: '50%'}}
                >
                    {group.users
                        .filter((u) => u.accepted)
                        .map((user) => {
                            return (
                                <Option value={user.name} key={user.alias}>
                                    <Avatar size="small" src={user.avatar}/>
                                    &nbsp;&nbsp; <strong>{user.alias}</strong>
                                </Option>
                            );
                        })}
                </Select>
                <Button
                    onClick={() => setAssignees(group!.users.map(u => u.name))}
                    style={{color: '#4ddbff'}} shape="round" size='small'>
                    All
                </Button></>
        );
    };

    const loginCookie = getCookie('__discourse_proxy');

    if (!loginCookie) {
        return <div className='choices-card'>
            <div className='choice-card'>
                <Result
                    status="warning"
                    title="Please Sign In"
                    subTitle="You need a Bullet Journal account to save these tasks into your own project (BuJo)"
                    extra={
                        <Button type="primary" key="sign-in" onClick={onGoSignIn}>
                            Go to Bullet Journal Sign In Page
                        </Button>
                    }
                />
            </div>
        </div>
    }

    if (projects.length === 0) {
        return <div className='choices-card'>
            <div className='choice-card'>
                <Result
                    status="warning"
                    title="Create Project"
                    subTitle="You need a TODO BuJo to save these events into it"
                    extra={<AddProject history={history} mode={'button'}/>}
                />
            </div>
        </div>
    }

    return <div className='choices-card'>
        <div className='choice-card'>
            <span>Project (BuJo) to save these events into</span>
        </div>
        <div className='choice-card'>
            <Select
                style={{padding: '3px', minWidth: '40%'}}
                placeholder="Choose BuJo"
                value={projectId}
                onChange={(value: any) => {
                    reset(projects.filter(p => p.id === value)[0]);
                }}
            >
                {projects.map((project) => {
                    return (
                        <Option value={project.id} key={project.id}>
                            <Tooltip
                                title={`${project.name} (Group ${project.group.name})`}
                                placement="right"
                            >
                                <span>
                                  <Avatar size="small" src={project.owner.avatar}/>
                                    &nbsp; {iconMapper[project.projectType]}
                                    &nbsp; <strong>{project.name}</strong>
                                    &nbsp; (Group <strong>{project.group.name}</strong>)
                                </span>
                            </Tooltip>
                        </Option>
                    );
                })}
            </Select>
        </div>
        <div className='choice-card'>
            <span>Users that will be notified for event occurrence</span>
        </div>
        <div className='choice-card'>
            {getUserSelections()}
        </div>
        <div className='choice-card'>
            <span>Attach labels to these events</span>
        </div>
        <div className='choice-card'>
            <Select
                mode="multiple"
                placeholder='Labels'
                allowClear={true}
                style={{padding: '3px', minWidth: '50%'}}
                value={labels}
                onChange={onChangeLabels}
                filterOption={(e, t) => onFilterLabel(e, t)}
            >
                {labelOptions &&
                labelOptions.length &&
                labelOptions.map((l) => {
                    return (
                        <Option value={l.id} key={l.value}>
                            {getIcon(l.icon)} &nbsp;{l.value}
                        </Option>
                    );
                })}
            </Select>
            <Button
                onClick={() => setLabels(labelOptions.map(l => l.id))}
                style={{color: '#4ddbff'}} shape="round" size='small'>
                All
            </Button>
        </div>
        {category && category.needStartDate && <div className='choice-card'>
            <span>When to start showing these events on your calendar (optional)</span>
        </div>}
        {category && category.needStartDate && <div className='choice-card'>
            <DatePicker
                allowClear={true}
                onChange={onChangeStartDate}
                style={{width: '180px', padding: '5px'}}
                placeholder="Start Date"
            />
        </div>}
        {category && category.needStartDate && <div className='choice-card'>
            <Select
                showSearch={true}
                style={{minWidth: '180px', padding: '5px'}}
                onChange={onChangeTimezone}
                placeholder="Select Time Zone"
                defaultValue={timezone ? timezone : ''}
            >
                {zones.map((zone: string, index: number) => (
                    <Option key={zone} value={zone}>
                        <Tooltip title={zone} placement="right">
                            {<span>{zone}</span>}
                        </Tooltip>
                    </Option>
                ))}
            </Select>
        </div>}
        <div className='choice-card'>
            <span>When to remind yourself before event happens</span>
        </div>
        <div className='choice-card'>
            <Select
                defaultValue={ReminderBeforeTaskText[before]}
                style={{width: '180px', padding: '5px'}}
                onChange={onChangeReminderBefore}
                placeholder="Reminder Before Event"
            >
                {ReminderBeforeTaskText.map((b: string, index: number) => (
                    <Option key={index} value={index}>
                        {b}
                    </Option>
                ))}
            </Select>
        </div>
        <div className='choice-card'>
            <Button
                onClick={onClickImport}
                style={{color: '#4ddbff', margin: '3px'}} shape="round">
                Import
            </Button>
        </div>
        <div className='confirm-button'>
            {loadingNextStep && <ReactLoading type="bubbles" color="#0984e3"/>}
        </div>
        <div className='subscribe-updates'>
            <Checkbox checked={subscribed} onChange={onChangeSubscribed}>Subscribe to future updates</Checkbox>
            <Tooltip title='New events will be added into your BuJo automatically'>
                <QuestionCircleTwoTone/>
            </Tooltip>
        </div>
    </div>

};

const mapStateToProps = (state: IState) => ({
    loadingNextStep: state.templates.loadingNextStep,
    ownedProjects: state.project.owned,
    sharedProjects: state.project.shared,
    group: state.group.group,
    myself: state.myself.username,
    timezone: state.settings.timezone,
    labelOptions: state.label.labelOptions,
    before: state.settings.before,
    category: state.templates.category,
    sampleTasks: state.templates.sampleTasks,
});

export default connect(mapStateToProps, {
    getGroup,
    labelsUpdate,
    importTasks,
    sampleTasksReceived
})(StepsImportTasksPage);
