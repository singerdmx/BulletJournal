import React, {useState} from 'react';
import {Divider, Form, Input, InputNumber, message, Modal, Radio} from 'antd';
import {CloseCircleTwoTone, PlusCircleTwoTone, PlusOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {Button as FloatButton, darkColors, lightColors} from "react-floating-action-button";
import {createRule} from "../../../features/templates/actions";
import {Category, Step} from "../../../features/templates/interface";

type AddRuleProps = {
    step: Step | undefined;
    category: Category | undefined;
    createRule: (name: string, priority: number, connectedStepId: number,
                 ruleExpression: string, categoryId?: number, stepId?: number) => void;
};

const AddRule: React.FC<AddRuleProps> = (props) => {
    const {createRule, step, category} = props;
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [ruleExpression, setRuleExpression] = useState<any[]>([]);
    const [selectionIds, setSelectionIds] = useState('');
    const [condition, setCondition] = useState('EXACT');

    const addRule = (values: any) => {
        if (ruleExpression.length === 0) {
            message.error('Missing Rule Expression');
            return;
        }
        const logicalOp = values.logicOperator ? values.logicOperator : 'AND';
        createRule(values.name, values.priority, values.connectedStepId, JSON.stringify(
            {rule: ruleExpression, logicOperator: logicalOp})
                .replace('"AND"', 'AND')
                .replace('"OR"', 'OR'),
            category ? category.id : undefined, step ? step.id : undefined);
        setVisible(false);
    };

    const onCancel = () => {
        setVisible(false);
        form.resetFields();
    };
    const openModal = () => {
        setVisible(true);
    };

    const addCondition = () => {
        if (selectionIds && /^[0-9,]*$/.test(selectionIds)) {
            ruleExpression.push({'condition': condition, 'selectionIds': selectionIds.split(',').map(s => parseInt(s)) });
            setRuleExpression(ruleExpression);
            console.log(ruleExpression);
            setSelectionIds('');
            setCondition('EXACT');
        } else {
            message.error('Selection IDs can only contain numbers or comma');
        }
    }

    const onChangeSelections = (e: React.ChangeEvent<HTMLInputElement>) => {
        const s = e.target.value;
        console.log(s);
        setSelectionIds(s.replace(/\s/g, ''));
    }

    const onChangeCondition = (e: any) => {
        setCondition(e.target.value);
    }

    const removeCondition = (i: number) => {
        let r = ruleExpression.length === 1 ? [] : ruleExpression.splice(i, 1);
        console.log(r);
        setRuleExpression(r);
        setSelectionIds('');
        setCondition('EXACT');
    }

    const getModal = () => {
        return (
            <Modal
                title='Create New Rule'
                centered
                visible={visible}
                okText='Create'
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            console.log(values);
                            form.resetFields();
                            addRule(values);
                        })
                        .catch((info) => console.log(info));
                }}
            >
                <Form form={form}>
                    <Form.Item
                        name='name'
                        label='name'
                        rules={[{required: true, message: 'Name must be between 1 and 30 characters', min: 1, max: 30}]}
                    >
                        <Input placeholder='Rule Name' allowClear/>
                    </Form.Item>
                    <Form.Item
                        name='priority'
                        label='Priority'
                        rules={[{required: true}]}
                    >
                        <InputNumber placeholder='Priority'/>
                    </Form.Item>
                    <Form.Item
                        name='connectedStepId'
                        label='Connected Step'
                        rules={[{required: true}]}
                    >
                        <InputNumber placeholder='ID'/>
                    </Form.Item>
                    <Form.Item
                        name='logicOperator'
                        label='Logic Operator for Rules'
                    >
                        <Radio.Group defaultValue='AND'>
                            <Radio value='AND'>AND</Radio>
                            <Radio value='OR'>OR</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Divider orientation="left">Create Rule Expression</Divider>
                    <div>
                        {ruleExpression.map((e, i) => {
                            return <div><span><b>{JSON.stringify(e)}</b></span> <CloseCircleTwoTone
                                onClick={() => removeCondition(i)}/></div>
                        })}
                    </div>
                    <div>
                        <div style={{padding: '10px'}}>
                            <Radio.Group value={condition} onChange={(e) => onChangeCondition(e)}>
                                <Radio value='EXACT'>EXACT</Radio>
                                <Radio value='CONTAINS'>CONTAINS</Radio>
                                <Radio value='NOT_CONTAIN'>NOT_CONTAIN</Radio>
                                <Radio value='IGNORE'>IGNORE</Radio>
                            </Radio.Group>
                        </div>
                        <span style={{padding: '10px'}}><Input style={{width: '60%'}}
                                                               value={selectionIds}
                                                               placeholder='Selection IDs, separated by comma'
                                                               onChange={(e) => onChangeSelections(e)}
                                                               allowClear/></span>
                        <PlusCircleTwoTone onClick={addCondition}/>
                    </div>
                </Form>
            </Modal>
        );
    };

    return (
        <>
            <FloatButton
                tooltip="Add New Rule"
                onClick={openModal}
                styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
            >
                <PlusOutlined/>
            </FloatButton>
            {getModal()}
        </>
    );
};

export default connect(null, {
    createRule
})(AddRule);
