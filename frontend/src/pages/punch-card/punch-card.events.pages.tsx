import React, {useEffect, useState} from 'react';
import './punch-card.styles.less';
import {Checkbox, Empty, Tooltip} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {deleteMySampleTask, getMySampleTasks} from "../../features/myself/actions";
import {SampleTask} from "../../features/templates/interface";
import {CheckCircleTwoTone, CloseCircleTwoTone, CloseOutlined} from "@ant-design/icons";
import {useHistory} from "react-router-dom";
import {Project} from "../../features/project/interface";

type TemplateEventsProps = {
    sampleTasks: SampleTask[];
    getMySampleTasks: () => void;
    deleteMySampleTask: (id: number) => void;
};

const TemplateEvents: React.FC<TemplateEventsProps> = (
    {
        sampleTasks,
        getMySampleTasks,
        deleteMySampleTask
    }) => {
    const history = useHistory();
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<number[]>([]);

    useEffect(() => {
        getMySampleTasks();
    }, []);


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

    const getEvents = () => {
        if (sampleTasks.length === 0) {
            return <Empty/>
        }

        return <div>
            <div className='control-task'>
                <Tooltip title='Select All'>
                    <CheckCircleTwoTone onClick={() => setTasks(sampleTasks.map(t => t.id))}/>
                </Tooltip>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Tooltip title='Deselect All'>
                    <CloseCircleTwoTone onClick={() => setTasks([])}/>
                </Tooltip>
            </div>
            <div>
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
            <div className='events-card'>
                {getEvents()}
            </div>
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    sampleTasks: state.myself.sampleTasks,
});

export default connect(mapStateToProps, {
    getMySampleTasks,
    deleteMySampleTask
})(TemplateEvents);
