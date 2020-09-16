import React, {useEffect} from 'react';
import './sample-task.styles.less';
import {BackTop, Tag} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getSampleTask, removeSampleTask} from "../../features/templates/actions";
import {SampleTask} from "../../features/templates/interface";
import {useHistory, useParams} from "react-router-dom";
import {DeleteFilled} from "@ant-design/icons";

type SampleTaskProps = {
    sampleTask: undefined | SampleTask;
    getSampleTask: (sampleTaskId: number) => void;
    removeSampleTask: (sampleTaskId: number) => void;
};

const SampleTaskPage: React.FC<SampleTaskProps> = (
    {
        sampleTask, getSampleTask, removeSampleTask
    }
) => {
    const {sampleTaskId} = useParams();
    useEffect(() => {
        if (sampleTaskId) {
            getSampleTask(parseInt(sampleTaskId));
        }
    }, [sampleTaskId]);
    const history = useHistory();

    if (!sampleTask) {
        return <div>{sampleTaskId} Not Found</div>
    }

    const handleDelete = (e: any) => {
        removeSampleTask(sampleTask.id);
        history.push('/admin/workflow');
    }

    return (
        <div className='sample-task-page'>
            <BackTop/>
            <div><DeleteFilled onClick={handleDelete}/></div>
            <div>
                <h2>{sampleTask.name}</h2>
                <Tag>{sampleTask.metadata}</Tag>
            </div>
        </div>
    );
};


const mapStateToProps = (state: IState) => ({
    sampleTask: state.templates.sampleTask
});

export default connect(mapStateToProps, {
    getSampleTask,
    removeSampleTask
})(SampleTaskPage);
