import React, {useState} from 'react';
import './admin-choice.styles.less';
import {Choice} from "../../features/templates/interface";
import {Button, Divider, Modal, Popover, Radio, Typography} from "antd";
import {DeleteFilled} from "@ant-design/icons";

const {Title, Text} = Typography;

type ChoiceProps = {
    choice: Choice;
    showPopover: boolean;
};

const AdminChoiceElem: React.FC<ChoiceProps> = (
    {
        choice,
        showPopover
    }) => {

    const [visible, setVisible] = useState(false);

    const openModal = () => {
        setVisible(true);
    };

    const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation();
        setVisible(false);
    };

    const nameChange = (input: any) => {
        console.log(input);
    }

    const selectionTextChane = (e: string, id: number) => {
        console.log(e);
    }

    const deleteSelection = (id: number) => {

    }

    const getModal = () => {
        return (
            <Modal
                width={900}
                title={<Title editable={{onChange: nameChange}}>{choice.name}</Title>}
                cancelText='Cancel'
                destroyOnClose
                visible={visible}
                onCancel={(e) => handleCancel(e)}
                footer={<span><Button type='primary'>Delete this Choice</Button></span>}
            >
                <div>
                    <div>
                        <Radio.Group value={choice.multiple}>
                            <Radio value={true}>Multiple Selections</Radio>
                            <Radio value={false}>Single Selection</Radio>
                        </Radio.Group>
                    </div>
                    <Divider/>
                    <div className='choices-popup'>
                        {choice.selections.map(s => <span>
                            <Text editable={{onChange: (e) => selectionTextChane(e, s.id)}}>{s.text}</Text> ({s.id})
                            <DeleteFilled style={{cursor: 'pointer'}} onClick={() => deleteSelection(s.id)}/>
                        </span>)}
                    </div>
                </div>
            </Modal>
        );
    }

    if (showPopover) {
        return (<Popover title='Selections' placement='right'
                         content={<div className='choices-popup'>
                             {choice.selections.map(s => <span>{s.text} ({s.id})</span>)}
                         </div>}>
               <span className='choice-elem' onClick={openModal}>
                {choice.name} ({choice.id})
                   {getModal()}
                </span>
            </Popover>
        );
    }

    return <span className='choice-elem' onClick={openModal}>
            {choice.name} ({choice.id})
        {getModal()}
    </span>
};


export default AdminChoiceElem;
