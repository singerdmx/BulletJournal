import React, {useEffect, useState} from 'react';
import './sample-task.styles.less';
import {BackTop, Button, message, Select, Tag, Typography} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getSampleTask, removeSampleTask, updateSampleTask} from "../../features/templates/actions";
import {SampleTask} from "../../features/templates/interface";
import {useHistory, useParams} from "react-router-dom";
import {CloseSquareTwoTone, DeleteFilled, DownloadOutlined} from "@ant-design/icons";
import {Divider} from "antd/es";
const {Title, Text} = Typography;
const {Option} = Select;

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
    const [selections, setSelections] = useState<number[]>([]);
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

    const onChoiceChange = (input: any) => {
        console.log(input);
        setSelections(input);
    }

    const onConfirm = () => {
        console.log(selections);
        if (selections.length === 0) {
            message.error('No selection');
            return;
        }
    }

    const choice = sampleTask.choice;
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
            <Divider/>
            <div>
                {choice && <div key={choice.id}>
                    <Select mode={choice.multiple ? 'multiple' : undefined}
                            clearIcon={<CloseSquareTwoTone/>}
                            showSearch={true}
                            placeholder={choice.name}
                            style={{padding: '3px', minWidth: choice.multiple ? '50%' : '5%'}}
                            onChange={onChoiceChange}
                            allowClear>
                        {choice.selections.map(selection => {
                            return <Option key={selection.text} value={selection.id}>{selection.text}</Option>
                        })}
                    </Select>
                    {' '}
                    <Button type="primary" shape="round" icon={<DownloadOutlined />} onClick={onConfirm}>
                        Confirm
                    </Button>
                </div>}
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
