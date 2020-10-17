import React, {useEffect, useState} from 'react';
import './admin-metadata.styles.less';
import {BackTop, Button, message, Table, Tooltip, Typography, Radio, Divider, InputNumber, Input} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {
    getChoiceMetadata,
    getSelectionMetadata,
    getStepMetadata,
    removeChoiceMetadata,
    updateChoiceMetadata,
    updateSelectionMetadata,
    removeSelectionMetadata,
    updateStepMetadata,
    removeStepMetadata,
    addStepMetadata,
    addSelectionMetadata,
    addChoiceMetadata
} from "../../features/admin/actions";
import {ChoiceMetadata, SelectionMetadata, StepMetadata} from "../../features/admin/interface";
import {DeleteTwoTone, PlusCircleTwoTone} from "@ant-design/icons";

const { Text } = Typography;

type AdminMetadataProps = {
    choiceMetadata: ChoiceMetadata[];
    selectionMetadata: SelectionMetadata[];
    stepMetadata: StepMetadata[];
    getChoiceMetadata: () => void;
    getSelectionMetadata: () => void;
    getStepMetadata: () => void;
    updateChoiceMetadata: (keyword: string, choiceId: number) => void;
    updateSelectionMetadata: (keyword: string, selectionId: number, frequency?: number) => void;
    removeChoiceMetadata: (keywords: string[]) => void;
    removeSelectionMetadata: (keywords: string[]) => void;
    updateStepMetadata: (keyword: string, stepId: number) => void;
    removeStepMetadata: (keywords: string[]) => void;
    addStepMetadata: (keyword: string, id: number) => void;
    addSelectionMetadata: (keyword: string, id: number) => void;
    addChoiceMetadata: (keyword: string, id: number) => void;
};

const AdminMetadataPage: React.FC<AdminMetadataProps> = (
    {
        choiceMetadata, getChoiceMetadata, updateChoiceMetadata, removeChoiceMetadata,
        selectionMetadata, getSelectionMetadata, updateSelectionMetadata, removeSelectionMetadata,
        stepMetadata, getStepMetadata, updateStepMetadata, removeStepMetadata,
        addStepMetadata, addSelectionMetadata, addChoiceMetadata
    }) => {

    const [type, setType] = useState<string>('Choice');
    const [keyword, setKeyword] = useState<string>('');
    const [id, setId] = useState<number>(0);
    const [checkedChoices, setCheckedChoices] = useState<string[]>([]);
    const [checkedSelections, setCheckedSelections] = useState<string[]>([]);
    const [checkedSteps, setCheckedSteps] = useState<string[]>([]);

    useEffect(() => {
        document.title = 'Bullet Journal - Metadata';
        getChoiceMetadata();
        getSelectionMetadata();
        getStepMetadata();
    }, []);

    const convertMetadata = (data: any) => {
        const res: any = {...data};
        res['key'] = data.keyword;
        return res;
    }

    const onChoiceChange = (e: string, row: any) => {
        console.log(row)
        console.log(e);
        if (!/^\d+$/.test(e)) {
            message.error("Invalid ID: " + e);
            return;
        }
        updateChoiceMetadata(row.key, parseInt(e));
    }

    const choiceMetadataColumns = [
        {
            title: 'Keyword',
            dataIndex: 'keyword',
            key: 'keyword',
            sorter: {
                compare: (a: any, b: any) => a.key.localeCompare(b.key),
                multiple: 1,
            },
        },
        {
            title: 'Choice',
            dataIndex: 'choice',
            key: 'choice',
            render: (choice: any, row: any) => (<span>
                {choice.name}{'  '}
                (<Text editable={{
                onChange: (e) => onChoiceChange(e, row),
            }}>{choice.id}
                </Text>)
            </span>),
        },
    ];

    const choiceRowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setCheckedChoices(selectedRows.map((r: any) => r.key));
        },
    };

    const onSelectionChange = (e: string, row: any) => {
        console.log(row)
        console.log(e);
        if (!/^\d+$/.test(e)) {
            message.error("Invalid ID: " + e);
            return;
        }
        updateSelectionMetadata(row.key, parseInt(e), row.frequency);
    }

    const onFrequencyChange = (e: string, row: any) => {
        console.log(row)
        console.log(e ? parseInt(e) : undefined);
        if (e && !/^\d+$/.test(e)) {
            message.error("Invalid Frequency: " + e);
            return;
        }
        updateSelectionMetadata(row.key, row.selection.id, e ? parseInt(e) : undefined);
    }

    const selectionMetadataColumns = [
        {
            title: 'Keyword',
            dataIndex: 'keyword',
            key: 'keyword',
            sorter: {
                compare: (a: any, b: any) => a.key.localeCompare(b.key),
                multiple: 1,
            },
        },
        {
            title: 'Selection',
            dataIndex: 'selection',
            key: 'selection',
            render: (selection: any, row: any) => (<span>
                {selection.text}{'  '}
                (<Text editable={{
                onChange: (e) => onSelectionChange(e, row),
            }}>{selection.id}
                </Text>)
            </span>),
        },
        {
            title: 'Frequency',
            dataIndex: 'frequency',
            key: 'frequency',
            render: (frequency: any, row: any) => (<span>
                    <Text editable={{
                        onChange: (e) => onFrequencyChange(e, row),
                    }}>{frequency}</Text>
            </span>)
        },
    ];

    const selectionRowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setCheckedSelections(selectedRows.map((r: any) => r.key));
        },
    };

    const onStepChange = (e: string, row: any) => {
        console.log(row)
        console.log(e);
        if (!/^\d+$/.test(e)) {
            message.error("Invalid ID: " + e);
            return;
        }
        updateStepMetadata(row.key, parseInt(e));
    }

    const stepMetadataColumns = [
        {
            title: 'Keyword',
            dataIndex: 'keyword',
            key: 'keyword',
            sorter: {
                compare: (a: any, b: any) => a.key.localeCompare(b.keyword),
                multiple: 1,
            },
        },
        {
            title: 'Step',
            dataIndex: 'step',
            key: 'step',
            render: (step: any, row: any) => (<span>
                {step.name}{'  '}
                (<Text editable={{
                onChange: (e) => onStepChange(e, row),
            }}>{step.id}
                </Text>)
            </span>),
        },
    ];

    const stepRowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setCheckedSteps(selectedRows.map((r: any) => r.key));
        },
    };

    const onDeleteChoiceMetadata = () => {
        if (checkedChoices.length === 0) {
            message.error('None selected!');
            return;
        }

        removeChoiceMetadata(checkedChoices);
        setCheckedChoices([]);
    }

    const onDeleteSelectionMetadata = () => {
        if (checkedSelections.length === 0) {
            message.error('None selected!');
            return;
        }

        removeSelectionMetadata(checkedSelections);
        setCheckedSelections([]);
    }

    const onDeleteStepMetadata = () => {
        if (checkedSteps.length === 0) {
            message.error('None selected!');
            return;
        }

        removeStepMetadata(checkedSteps);
        setCheckedSteps([]);
    }

    const onChangeType = (e: any) => {
        setType(e.target.value);
    }

    const addMetadata = () => {
        if (!keyword) {
            message.error("Empty Keyword Input");
            return;
        }

        if (!id) {
            message.error("Empty ID Input");
            return;
        }
        switch (type) {
            case 'Choice':
                addChoiceMetadata(keyword, id);
                break;
            case 'Selection':
                addSelectionMetadata(keyword, id);
                break;
            case 'Step':
                addStepMetadata(keyword, id);
                break;
        }
    }

    return (
        <div className='metadata-page'>
            <BackTop/>
            <Divider/>
            <div>
                <Radio.Group onChange={onChangeType} value={type}>
                    <Radio.Button value="Choice">Choice</Radio.Button>
                    <Radio.Button value="Selection">Selection</Radio.Button>
                    <Radio.Button value="Step">Step</Radio.Button>
                </Radio.Group>
                <Input
                    allowClear={true}
                    style={{ width: '300px', marginLeft: '12px', marginRight: '12px'}}
                    placeholder='Keyword'
                    value={keyword}
                    onChange={(value) => {
                        const s = value.target.value;
                        console.log(s);
                        setKeyword(s);
                    }}/>
                <InputNumber
                    style={{ width: '80px', marginLeft: '12px', marginRight: '12px'}}
                    placeholder='ID'
                    onChange={(value) => {
                        if (!value || isNaN(value)) setId(0);
                        else setId(value);
                    }}/>
                <Button onClick={addMetadata} type="primary" shape="round" icon={<PlusCircleTwoTone />}>
                    Add
                </Button>
            </div>
            <Divider/>
            <div>
                <h3>
                    Choice Metadata {'  '}
                    <Tooltip title='Delete Choice Metadata'>
                        <Button onClick={onDeleteChoiceMetadata} shape="circle" icon={<DeleteTwoTone />} />
                    </Tooltip>
                </h3>
                <Table rowSelection={choiceRowSelection}
                       columns={choiceMetadataColumns} dataSource={choiceMetadata.map(c => convertMetadata(c))}/>
            </div>
            <div>
                <h3>
                    Selection Metadata {'  '}
                    <Tooltip title='Delete Selection Metadata'>
                        <Button onClick={onDeleteSelectionMetadata} shape="circle" icon={<DeleteTwoTone />} />
                    </Tooltip>
                </h3>
                <Table rowSelection={selectionRowSelection}
                       columns={selectionMetadataColumns} dataSource={selectionMetadata.map(c => convertMetadata(c))}/>
            </div>
            <div>
                <h3>
                    Step Metadata {'  '}
                    <Tooltip title='Delete Step Metadata'>
                        <Button onClick={onDeleteStepMetadata} shape="circle" icon={<DeleteTwoTone />} />
                    </Tooltip>
                </h3>
                <Table rowSelection={stepRowSelection}
                       columns={stepMetadataColumns} dataSource={stepMetadata.map(c => convertMetadata(c))}/>
            </div>
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    choiceMetadata: state.admin.choiceMetadata,
    selectionMetadata: state.admin.selectionMetadata,
    stepMetadata: state.admin.stepMetadata
});

export default connect(mapStateToProps, {
    getChoiceMetadata,
    updateChoiceMetadata,
    removeChoiceMetadata,
    getSelectionMetadata,
    updateSelectionMetadata,
    removeSelectionMetadata,
    getStepMetadata,
    updateStepMetadata,
    removeStepMetadata,
    addStepMetadata,
    addSelectionMetadata,
    addChoiceMetadata
})(AdminMetadataPage);
