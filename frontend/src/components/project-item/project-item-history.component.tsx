// note item component for note tree
// react import
import React, {useEffect, useState} from 'react';
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
import {ProjectItemType} from "../../features/project/constants";
import Quill from "quill";
import {createHTML} from "../content/content-item.component";

const Delta = Quill.import('delta');

type ProjectHistoryProps = {
    activities: ProjectItemActivity[];
    historyIndex: number;
    projectItemType: ProjectItemType;
};

const ProjectItemHistory: React.FC<ProjectHistoryProps> = (props) => {
    const {activities, historyIndex,projectItemType} = props;
    const [hideDiff, setHideDiff] = useState(true);
    const [currentHistory, setCurrentHistory] = useState(activities[historyIndex]);

    useEffect(()=>{
        setCurrentHistory(
            activities[historyIndex]
        );
    },[activities])

    useEffect(() => {
        setCurrentHistory(
            activities[historyIndex]
        );
        setHideDiff(true);
    }, [historyIndex])

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

    if(currentHistory.afterActivity == null){
        // @ts-ignore
        const previousHtmlBody = createHTML( new Delta(currentHistory.beforeActivity.content.delta));
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
        const parseHTML = (a: ActivityObject, id: string) => {
            let projectItem;
            if (projectItemType === ProjectItemType.NOTE) {
                projectItem = a.projectItem as Note;
                const html = <div id={id}>
                    <h1>{projectItem.name}</h1>
                    <ol style={{listStyle: "none"}}>
                        {projectItem.labels.length>0 && <li key={projectItem.id + "labels"}>Labels: {projectItem.labels.map((label: any) => (
                            <span key={label.id}>{label.value}{' '}</span>
                        ))}</li>}
                        {projectItem.location && <li key={projectItem.id + "location"}>Location: {projectItem.location}</li>}
                    </ol>
                </div>;

                return html;
            }
            return <p></p>;
        }

        const previousHtmlBody = parseHTML(currentHistory.beforeActivity, "project-item-before-activity-html");
        const currentHtmlBody = parseHTML(currentHistory.afterActivity, "project-item-after-activity-html");
        const beforeEl = document.getElementById("project-item-before-activity-html");
        const afterEl = document.getElementById("project-item-after-activity-html");
        // @ts-ignore
        const diff = beforeEl && afterEl ? getHtmlDiff(beforeEl.innerHTML, afterEl.innerHTML) : `<p></p>`;

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
                            {previousHtmlBody}
                        </div>
                    </div>
                    <div className="revision-content">
                        <div className="project-item-history"
                             style={{display: "flex", flexDirection: "row", paddingBottom: "5px"}}>
                            <div>{getHideDiffButton()}</div>
                            <div style={{fontWeight: "bold"}}>After update</div>
                        </div>
                        <div className="project-item-html">
                            {hideDiff ? currentHtmlBody : <div dangerouslySetInnerHTML={{__html: diff}}></div>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

const mapStateToProps = (state: IState) => ({

});

export default connect(mapStateToProps, {})(ProjectItemHistory);
