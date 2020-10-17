import React, {useEffect, useState} from 'react';
import './sample-task.styles.less';
import {BackTop, Button, Checkbox, message, Select, Tag, Typography} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getSampleTask, removeSampleTask, updateSampleTask} from "../../features/templates/actions";
import {SampleTask} from "../../features/templates/interface";
import {useHistory, useParams} from "react-router-dom";
import {CloseSquareTwoTone, DeleteFilled, DownloadOutlined, SearchOutlined} from "@ant-design/icons";
import {Divider} from "antd/es";
import {approveSampleTask} from "../../features/admin/actions";
const {Title, Text} = Typography;
const {Option} = Select;

type SampleTaskProps = {
    sampleTask: undefined | SampleTask;
    getSampleTask: (sampleTaskId: number) => void;
    approveSampleTask: (sampleTaskId: number, choiceId: number, selections: number[]) => void;
    removeSampleTask: (sampleTaskId: number) => void;
    updateSampleTask: (sampleTaskId: number, name: string, uid: string, content: string, metadata: string, pending: boolean, refreshable: boolean) => void;
};

const AdminSampleTaskPage: React.FC<SampleTaskProps> = (
    {
        sampleTask, getSampleTask, removeSampleTask, updateSampleTask, approveSampleTask
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
        updateSampleTask(sampleTask.id, input, sampleTask.uid, sampleTask.content, sampleTask.metadata, sampleTask.pending, sampleTask.refreshable);
    }

    const metadataChange = (input: any) => {
        console.log(input);
        if (!input) {
            message.error('metadata cannot be empty');
            return;
        }
        updateSampleTask(sampleTask.id, sampleTask.name, sampleTask.uid, sampleTask.content, input, sampleTask.pending, sampleTask.refreshable);
    }

    const uidChange = (input: any) => {
        console.log(input);
        if (!input) {
            message.error('uid cannot be empty');
            return;
        }
        updateSampleTask(sampleTask.id, sampleTask.name, input, sampleTask.content, sampleTask.metadata, sampleTask.pending, sampleTask.refreshable);
    }

    const onChoiceChange = (e: any) => {
        setSelections(Array.isArray(e) ? e : [e]);
    }

    const onConfirm = (choiceId: number) => {
        console.log(selections);
        if (selections.length === 0) {
            message.error('No selection');
            return;
        }

        approveSampleTask(sampleTask.id, choiceId, selections);
    }

    const onChangePending = (value: any) => {
        console.log(value.target.checked);
        if (sampleTask) {
            updateSampleTask(sampleTask.id, sampleTask.name, sampleTask.uid, sampleTask.content, sampleTask.metadata, value.target.checked, sampleTask.refreshable);
        }
    }

    const onChangeRefreshable = (value: any) => {
        if (sampleTask) {
            updateSampleTask(sampleTask.id, sampleTask.name, sampleTask.uid, sampleTask.content, sampleTask.metadata, sampleTask.pending, value.target.checked);
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
                &nbsp;&nbsp;&nbsp;
                <Checkbox checked={sampleTask.pending} onChange={onChangePending}>
                    pending
                </Checkbox>
                <Checkbox checked={sampleTask.refreshable} onChange={onChangeRefreshable}>
                    refreshable
                </Checkbox>
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
                    <Button type="primary" shape="round" icon={<DownloadOutlined />} onClick={() => onConfirm(choice.id)}>
                        Confirm
                    </Button>
                </div>}
            </div>
            <Divider/>
            <div>
                <Button type="primary" shape="round" icon={<SearchOutlined />}
                        onClick={() => history.push(`/sampleTasks/${sampleTask.id}`)}>
                    View Content
                </Button>
            </div>
            {sampleTask.raw && <div>
            <Divider/>
            <div>
                {sampleTask.raw}
            </div></div>}
        </div>
    );
};


const mapStateToProps = (state: IState) => ({
    sampleTask: state.templates.sampleTask
});

export default connect(mapStateToProps, {
    getSampleTask,
    removeSampleTask,
    updateSampleTask,
    approveSampleTask
})(AdminSampleTaskPage);
