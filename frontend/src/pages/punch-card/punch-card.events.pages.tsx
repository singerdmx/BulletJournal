import React, {useEffect, useState} from 'react';
import './punch-card.styles.less';
import {Avatar, Button, Checkbox, DatePicker, Empty, message, Select, Tooltip} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {deleteMySampleTask, getMySampleTasks, deleteMySampleTasks} from "../../features/myself/actions";
import {SampleTask} from "../../features/templates/interface";
import {CheckCircleTwoTone, CloseCircleTwoTone, CloseOutlined} from "@ant-design/icons";
import {useHistory} from "react-router-dom";
import {Project, ProjectsWithOwner} from "../../features/project/interface";
import {getGroup} from "../../features/group/actions";
import {labelsUpdate} from "../../features/label/actions";
import {Label} from "../../features/label/interface";
import {Group} from "../../features/group/interface";
import {flattenOwnedProject, flattenSharedProject} from "../projects/projects.pages";
import {ProjectType} from "../../features/project/constants";
import {iconMapper} from "../../components/side-menu/side-menu.component";
import '../templates/steps.styles.less';
import {onFilterAssignees, onFilterLabel} from "../../utils/Util";
import {getIcon} from "../../components/draggable-labels/draggable-label-list.component";
import {zones} from "../../components/settings/constants";
import {ReminderBeforeTaskText} from "../../components/settings/reducer";
import ReactLoading from "react-loading";

const {Option} = Select;

type TemplateEventsProps = {
    myself: string;
    timezone: string;
    labelOptions: Label[];
    before: number;
    ownedProjects: Project[];
    sharedProjects: ProjectsWithOwner[];
    sampleTasks: SampleTask[];
    group: Group | undefined;
    removingSampleTasks: boolean;
    getGroup: (groupId: number) => void;
    labelsUpdate: (projectId: number | undefined) => void;
    getMySampleTasks: () => void;
    deleteMySampleTask: (id: number) => void;
    deleteMySampleTasks: (sampleTasks: number[],
                          projectId: number, assignees: string[],
                          reminderBefore: number, labels: number[],
                          startDate?: string, timezone?: string) => void;
};

const TemplateEvents: React.FC<TemplateEventsProps> = (
    {
        removingSampleTasks,
        myself, labelOptions, ownedProjects, sharedProjects, group,
        timezone, before, getGroup, labelsUpdate,
        sampleTasks,
        getMySampleTasks,
        deleteMySampleTask,
        deleteMySampleTasks
    }) => {
    const history = useHistory();
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<number[]>([]);
    const [projectId, setProjectId] = useState(-1);
    const [assignees, setAssignees] = useState<string[]>([]);
    const [labels, setLabels] = useState<number[]>([]);
    const [startDate, setStartDate] = useState<string>('');
    const [targetTimezone, setTargetTimezone] = useState(timezone ? timezone : new window.Intl.DateTimeFormat().resolvedOptions().timeZone);
    const [reminderBefore, setReminderBefore] = useState<number>(before);

    useEffect(() => {
        getMySampleTasks();
    }, []);

    const reset = (project: Project) => {
        setProjectId(project.id);
        getGroup(project.group.id);
        labelsUpdate(project.id);
        setAssignees([myself]);
        setTargetTimezone(timezone);
        setReminderBefore(before);
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

    function onRemoveTask(e: React.MouseEvent<HTMLElement>, id: number) {
        e.preventDefault();
        e.stopPropagation();
        deleteMySampleTask(id);
    }

    function onSelectSampleTask(e: any, id: number) {
        console.log('onSelectSampleTask', e, id)
        if (e.target.checked) {
            const l = [...tasks];
            l.push(id);
            setTasks(l);
        } else {
            setTasks(tasks.filter(t => t !== id));
        }
    }

    const onClickImport = () => {
        if (tasks.length === 0) {
            message.error('Nothing selected');
            return;
        }
        deleteMySampleTasks(tasks, projectId, assignees, reminderBefore, labels, startDate, targetTimezone);
    }

    const getEvents = () => {
        if (sampleTasks.length === 0) {
            return <Empty/>
        }

        return <div>
            <div className='control-task'>
                <Tooltip title='Select All'>
                    <CheckCircleTwoTone onClick={() => setTasks(sampleTasks.map(t => t.id))}/>
                </Tooltip>
                &nbsp;&nbsp;
                &nbsp;&nbsp;
                <Tooltip title='Deselect All'>
                    <CloseCircleTwoTone onClick={() => setTasks([])}/>
                </Tooltip>
            </div>
            <div className='events-card'>
                {sampleTasks.map(sampleTask => {
                    return <div className='sample-task' onClick={() => history.push(`/sampleTasks/${sampleTask.id}`)}>
                        <span>
                            <Tooltip title="Select this">
                                <Checkbox
                                    checked={tasks.includes(sampleTask.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => onSelectSampleTask(e, sampleTask.id)}/>
                            </Tooltip>
                        </span>
                        <div className='remove-task-icon'>
                            <Tooltip title='Remove this'>
                                <CloseOutlined onClick={(e) => onRemoveTask(e, sampleTask.id)}/>
                            </Tooltip>
                        </div>
                        {sampleTask.name}
                    </div>
                })}
            </div>
            <div className='choices-card'>
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
                <div className='choice-card'>
                    <span>When to show these events on your calendar</span>
                </div>
                <div className='choice-card'>
                    <DatePicker
                        allowClear={true}
                        onChange={onChangeStartDate}
                        style={{width: '180px', padding: '5px'}}
                        placeholder="Start Date"
                    />
                </div>
                <div className='choice-card'>
                    <Select
                        showSearch={true}
                        style={{minWidth: '180px', padding: '5px'}}
                        onChange={onChangeTimezone}
                        placeholder="Select Time Zone"
                        defaultValue={targetTimezone ? targetTimezone : ''}
                    >
                        {zones.map((zone: string, index: number) => (
                            <Option key={zone} value={zone}>
                                <Tooltip title={zone} placement="right">
                                    {<span>{zone}</span>}
                                </Tooltip>
                            </Option>
                        ))}
                    </Select>
                </div>
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
                    {removingSampleTasks && <ReactLoading type="bubbles" color="#0984e3"/>}
                </div>
            </div>
        </div>
    }
    return (
        <div>
            <div className='banner'>
                <a id="templates_pic"
                   href="https://bulletjournal.us/public/templates">
                    <img className="banner-pic"
                         src="https://user-images.githubusercontent.com/122956/93190453-3df4d800-f6f8-11ea-8a66-4074db4adc70.png"
                         alt="Templates"/>
                </a>
            </div>
            <div>
                {getEvents()}
            </div>
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    sampleTasks: state.myself.sampleTasks,
    ownedProjects: state.project.owned,
    sharedProjects: state.project.shared,
    group: state.group.group,
    myself: state.myself.username,
    timezone: state.settings.timezone,
    labelOptions: state.label.labelOptions,
    before: state.settings.before,
    removingSampleTasks: state.myself.removingSampleTasks
});

export default connect(mapStateToProps, {
    getMySampleTasks,
    deleteMySampleTask,
    deleteMySampleTasks,
    getGroup,
    labelsUpdate,
})(TemplateEvents);
