import React, {useEffect} from 'react';
import './punch-card.styles.less';
import {Empty, Tooltip} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getMySampleTasks} from "../../features/myself/actions";
import {SampleTask} from "../../features/templates/interface";
import {CloseOutlined} from "@ant-design/icons";
import '../templates/steps.styles.less'

type TemplateEventsProps = {
    sampleTasks: SampleTask[];
    getMySampleTasks: () => void;
};

const TemplateEvents: React.FC<TemplateEventsProps> = (
    {
        sampleTasks,
        getMySampleTasks
    }) => {

    useEffect(() => {
        getMySampleTasks();
    }, []);

    const onRemoveTask = (id: number) => {
        // const data = sampleTasks.filter(t => t.id !== id);
    }

    const getEvents = () => {
        if (sampleTasks.length === 0) {
            return <Empty/>
        }

        return <div>
            {sampleTasks.map(sampleTask => {
                return <div className='sample-task'>
                    <div className='remove-task-icon'>
                        <Tooltip title='Remove this'>
                            <CloseOutlined onClick={() => onRemoveTask(sampleTask.id)}/>
                        </Tooltip>
                    </div>
                    {sampleTask.name}
                </div>
            })}
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
    getMySampleTasks
})(TemplateEvents);
