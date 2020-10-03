import React, {useEffect, useState} from 'react';
import './admin-metadata.styles.less';
import {BackTop, Button, message, Table, Tooltip, Typography} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {
    getChoiceMetadata,
    getSelectionMetadata,
    removeChoiceMetadata,
    updateChoiceMetadata, updateSelectionMetadata
} from "../../features/admin/actions";
import {ChoiceMetadata, SelectionMetadata} from "../../features/admin/interface";
import {DeleteTwoTone} from "@ant-design/icons";

const { Text } = Typography;

type AdminMetadataProps = {
    choiceMetadata: ChoiceMetadata[];
    selectionMetadata: SelectionMetadata[];
    getChoiceMetadata: () => void;
    getSelectionMetadata: () => void;
    updateChoiceMetadata: (keyword: string, choiceId: number) => void;
    updateSelectionMetadata: (keyword: string, selectionId: number) => void;
};

const AdminMetadataPage: React.FC<AdminMetadataProps> = (
    {
        choiceMetadata, getChoiceMetadata, updateChoiceMetadata,
        selectionMetadata, getSelectionMetadata, updateSelectionMetadata
    }) => {

    const [checkedChoices, setCheckedChoices] = useState<string[]>([]);
    const [checkedSelections, setCheckedSelections] = useState<string[]>([]);
    const [checkedSteps, setCheckedSteps] = useState<string[]>([]);

    useEffect(() => {
        document.title = 'Bullet Journal - Metadata';
        getChoiceMetadata();
        getSelectionMetadata();
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
                compare: (a: any, b: any) => a.key.localeCompare(b.keyword),
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
        updateSelectionMetadata(row.key, parseInt(e));
    }

    const selectionMetadataColumns = [
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
    ];

    const selectionRowSelection = {
        onChange: (selectedRowKeys: any, selectedRows: any) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setCheckedSelections(selectedRows.map((r: any) => r.key));
        },
    };

    return (
        <div className='metadata-page'>
            <BackTop/>
            <div>
                <h3>Choice Metadata {'  '} <Tooltip title='Delete Choice Metadata'><Button shape="circle" icon={<DeleteTwoTone />} /></Tooltip></h3>
                <Table rowSelection={choiceRowSelection}
                       columns={choiceMetadataColumns} dataSource={choiceMetadata.map(c => convertMetadata(c))}/>
            </div>
            <div>
                <h3>Selection Metadata {'  '} <Tooltip title='Delete Selection Metadata'><Button shape="circle" icon={<DeleteTwoTone />} /></Tooltip></h3>
                <Table rowSelection={selectionRowSelection}
                       columns={selectionMetadataColumns} dataSource={selectionMetadata.map(c => convertMetadata(c))}/>
            </div>
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    choiceMetadata: state.admin.choiceMetadata,
    selectionMetadata: state.admin.selectionMetadata
});

export default connect(mapStateToProps, {
    getChoiceMetadata,
    updateChoiceMetadata,
    removeChoiceMetadata,
    getSelectionMetadata,
    updateSelectionMetadata
})(AdminMetadataPage);
