// note item component for note tree
// react import
import React, {useEffect, useState} from 'react';
import ReactDOMServer from 'react-dom/server';
import {connect} from 'react-redux';
// antd imports
import {Avatar, Button, Tag, Tooltip} from 'antd';
// assets import
import {IState} from '../../store';
import {EyeInvisibleOutlined, EyeOutlined} from "@ant-design/icons";
import {ActivityObject, ProjectItemActivity} from "../../features/projectItem/interface";
import {getHtmlDiff} from "../../utils/htmldiff/htmldiff";
import moment from "moment-timezone";
import {Note} from "../../features/notes/interface";
import {ProjectType} from "../../features/project/constants";
import Quill from "quill";
import {createHTML} from "../content/content-item.component";
import {getReminderSettingString, Task} from "../../features/tasks/interface";
import {getDuration} from "./task-item.component";
import {convertToTextWithRRule} from "../../features/recurrence/actions";
import {Label} from "../../features/label/interface";
import {User} from "../../features/group/interface";
import {Transaction} from "../../features/transactions/interface";

const Delta = Quill.import('delta');
const LocaleCurrency = require('locale-currency');

type ProjectHistoryProps = {
    projectItemHistories: ProjectItemActivity[];
    historyIndex: number;
    projectType: ProjectType;
    currency: string;
};

const ProjectItemHistory: React.FC<ProjectHistoryProps> = (props) => {
    const {projectItemHistories, historyIndex, projectType, currency} = props;
    const [hideDiff, setHideDiff] = useState(false);
    const [currentHistory, setCurrentHistory] = useState(projectItemHistories[historyIndex]);

    const [beforeHtmlBody, setBeforeHtmlBody] = useState();
    const [afterHtmlBody, setAfterHtmlBody] = useState();
    const [diff, setDiff] = useState();

    useEffect(() => {
        setCurrentHistory(
            projectItemHistories[historyIndex]
        );
        setHideDiff(false);
    }, [projectItemHistories, historyIndex])

    useEffect(() => {
        if (currentHistory.afterActivity) {
            setAfterHtmlBody(parseHTML(currentHistory.afterActivity, "project-item-after-activity-html"));
            setBeforeHtmlBody(parseHTML(currentHistory.beforeActivity, "project-item-before-activity-html"));
        }
    }, [currentHistory])

    useEffect(() => {
        if (currentHistory.afterActivity && beforeHtmlBody && afterHtmlBody) {
            const beforeHtmlString = ReactDOMServer.renderToString(beforeHtmlBody);
            const afterHtmlString = ReactDOMServer.renderToString(afterHtmlBody);
            setDiff(getHtmlDiff(beforeHtmlString, afterHtmlString));
        }
    }, [beforeHtmlBody, afterHtmlBody])

    const getAvatarAndName = (assignee: User) => {
        return <span>
                    <Avatar src={assignee.avatar} size={20} style={{marginRight: "1px", marginLeft: "7px"}}/>
            {assignee.name}
                </span>
    }

    const getUser = (users: User[]) => {
        return <div>
            {users.map((u, index) => (
                <span key={index}>{getAvatarAndName(u)}</span>
            ))}
        </div>
    }

    const getTaskDue = (task: Task) => {
        if (task.recurrenceRule) {
            let s = convertToTextWithRRule(task.recurrenceRule);
            return 'Due: ' + s;
        }

        if (!task.dueDate) {
            return null;
        }

        return <span>Due: {task.dueDate} {task.dueTime}</span>;
    }

    const getLabelString = (labels: Label[]) => {
        return "Labels: " + labels.map(label => label.value).join(", ");
    }

    const getLocation = (location: string) => {
        return "Location: " + location;
    }

    const parseHTML = (a: ActivityObject, id: string) => {
        let projectItem;
        if (projectType === ProjectType.NOTE) {
            projectItem = a.projectItem as Note;
            return <div id={id}>
                <h1>{projectItem.name}</h1>
                <ol style={{listStyle: "none", paddingLeft: "0px"}}>
                    {projectItem.labels.length > 0 &&
                    <li key={projectItem.id + "labels"}>{getLabelString(projectItem.labels)}</li>}
                    {projectItem.location &&
                    <li key={projectItem.id + "location"}>{getLocation(projectItem.location)}</li>}
                </ol>
            </div>;
        } else if (projectType === ProjectType.TODO) {
            projectItem = a.projectItem as Task;
            return <div id={id}>
                <h1>{projectItem.name}</h1>
                <ol style={{listStyle: "none", paddingLeft: "0px"}}>
                    {projectItem.assignees && <li>Assignees: {getUser(projectItem.assignees)}</li>}
                    <li key={projectItem.id + "due"}>{getTaskDue(projectItem)} {projectItem.timezone}</li>
                    {projectItem.duration && <li>Duration: {getDuration(projectItem.duration)}</li>}
                    {projectItem.reminderSetting && projectItem.reminderSetting.date &&
                    <li>{getReminderSettingString(projectItem.reminderSetting)}</li>}
                    {projectItem.labels.length > 0 &&
                    <li key={projectItem.id + "labels"}>{getLabelString(projectItem.labels)}</li>}
                    {projectItem.location &&
                    <li key={projectItem.id + "location"}>{getLocation(projectItem.location)}</li>}
                </ol>
            </div>;
        } else if (projectType === ProjectType.LEDGER) {
            projectItem = a.projectItem as Transaction;
            return <div id={id}>
                <h1>{projectItem.name}</h1>
                <ol style={{listStyle: "none", paddingLeft: "0px"}}>
                    <li>Payer:{getAvatarAndName(projectItem.payer)}</li>
                    <li>{projectItem.transactionType == 0 ? "Income" : "Expense"}: {projectItem.amount} {LocaleCurrency.getCurrency(currency)}</li>
                    {projectItem.recurrenceRule
                        ? <li>{convertToTextWithRRule(projectItem.recurrenceRule)} {projectItem.timezone}</li>
                        : <li>{projectItem.date} {projectItem.time} {projectItem.timezone}</li>}
                    {projectItem.labels.length > 0 &&
                    <li key={projectItem.id + "labels"}>{getLabelString(projectItem.labels)}</li>}
                    {projectItem.location &&
                    <li key={projectItem.id + "location"}>{getLocation(projectItem.location)}</li>}
                    {projectItem.bankAccount && <li key={projectItem.id + "bankAccount"}>Bank
                        Account: {projectItem.bankAccount.name} {projectItem.bankAccount.accountNumber}</li>}
                </ol>
            </div>
        }
    }
    const getHideDiffButton = () => {
        return (
            <Tooltip title={hideDiff ? 'Show difference' : 'Do not show difference'}>
                <Button
                    onClick={() => setHideDiff(!hideDiff)}
                    size="small"
                    shape="circle"
                    type="primary"
                    style={{marginRight: '0.5rem'}}
                >
                    {hideDiff ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
                </Button>
            </Tooltip>
        );
    };

    if (currentHistory.afterActivity == null) {
        // @ts-ignore
        const previousHtmlBody = createHTML(new Delta(currentHistory.beforeActivity.content.delta));
        return (
            <div>
                <div className="revision-container">
                    <div className="revision-content">
                        <div className="project-item-history" style={{display: "flex", flexDirection: "row"}}>
                            <div><Avatar src={currentHistory.originator.avatar}/></div>
                            <div style={{
                                fontWeight: "bold",
                                marginRight: "10px",
                                marginLeft: "5px"
                            }}>{currentHistory.originator.name}</div>
                            <div style={{marginRight: "10px"}}>deleted content</div>
                            <Tag color="blue">{`${moment(currentHistory.activityTime).format('MMM Do YYYY')}`}</Tag>
                        </div>
                        <div className="project-item-content-html">
                            {<div dangerouslySetInnerHTML={{__html: previousHtmlBody}}></div>}
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <div className="revision-container">
                    <div className="revision-content">
                        <div className="project-item-history" style={{display: "flex", flexDirection: "row"}}>
                            <div><Avatar src={currentHistory.originator.avatar}/></div>
                            <div style={{
                                fontWeight: "bold",
                                marginRight: "10px",
                                marginLeft: "5px"
                            }}>{currentHistory.originator.name}</div>
                            <Tag color="blue">{`${moment(currentHistory.activityTime).format('MMM Do YYYY')}`}</Tag>
                        </div>
                        <div className="project-item-html">
                            {beforeHtmlBody}
                        </div>
                    </div>
                    <div className="revision-content">
                        <div className="project-item-history"
                             style={{display: "flex", flexDirection: "row", paddingBottom: "5px"}}>
                            <div>{getHideDiffButton()}</div>
                            <div style={{fontWeight: "bold"}}>After update</div>
                        </div>
                        <div className="project-item-html">
                            {hideDiff ? afterHtmlBody : <div dangerouslySetInnerHTML={{__html: diff}}></div>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

const mapStateToProps = (state: IState) => ({
    currency: state.myself.currency
});

export default connect(mapStateToProps, {})(ProjectItemHistory);
