import React, {useEffect} from 'react';
import './sample-task.styles.less';
import {BackTop, message, Tag, Typography} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getSampleTask, removeSampleTask, updateSampleTask} from "../../features/templates/actions";
import {SampleTask} from "../../features/templates/interface";
import {useHistory, useParams} from "react-router-dom";
import {DeleteFilled} from "@ant-design/icons";
const {Title, Text} = Typography;

type SampleTaskProps = {
    sampleTask: undefined | SampleTask;
    getSampleTask: (sampleTaskId: number) => void;
    removeSampleTask: (sampleTaskId: number) => void;
    updateSampleTask: (sampleTaskId: number, name: string, uid: string, content: string, metadata: string) => void;
};

const SampleTaskPage: React.FC<SampleTaskProps> = (
    {
        sampleTask, getSampleTask, removeSampleTask, updateSampleTask
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

    const nameChange = (input: any) => {
        console.log(input);
        if (!input) {
            message.error('name cannot be empty');
            return;
        }
        updateSampleTask(sampleTask.id, input, sampleTask.uid, sampleTask.content, sampleTask.metadata);
    }

    const metadataChange = (input: any) => {
        console.log(input);
        if (!input) {
            message.error('metadata cannot be empty');
            return;
        }
        updateSampleTask(sampleTask.id, sampleTask.name, sampleTask.uid, sampleTask.content, input);
    }

    const uidChange = (input: any) => {
        console.log(input);
        if (!input) {
            message.error('uid cannot be empty');
            return;
        }
        updateSampleTask(sampleTask.id, sampleTask.name, input, sampleTask.content, sampleTask.metadata);
    }

    return (
        <div className='sample-task-page'>
            <BackTop/>
            <div><DeleteFilled onClick={handleDelete}/></div>
            <div>
                <Title editable={{onChange: nameChange}}>{sampleTask.name}</Title>
                <Tag><Text
                    editable={{onChange: metadataChange}}>{sampleTask.metadata}</Text></Tag>
                (<Text
                editable={{onChange: uidChange}}>{sampleTask.uid}</Text>)
            </div>
        </div>
    );
};


const mapStateToProps = (state: IState) => ({
    sampleTask: state.templates.sampleTask
});

export default connect(mapStateToProps, {
    getSampleTask,
    removeSampleTask,
    updateSampleTask
})(SampleTaskPage);
