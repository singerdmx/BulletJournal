import React, {useState} from 'react';
import './admin-choice.styles.less';
import {Choice} from "../../features/templates/interface";
import {Button, Divider, Modal, Popover, Radio, Typography} from "antd";
import {DeleteFilled} from "@ant-design/icons";
import {connect} from "react-redux";
import {deleteChoice, deleteSelection, updateChoice, updateSelection} from "../../features/templates/actions";

const {Title, Text} = Typography;

type ChoiceProps = {
    choice: Choice;
    showPopover: boolean;
    deleteChoice: (id: number) => void;
    deleteSelection: (id: number) => void;
    updateChoice: (id: number, name: string, multiple: boolean) => void;
    updateSelection: (id: number, text: string) => void;
};

const AdminChoiceElem: React.FC<ChoiceProps> = (
    {
        choice,
        showPopover,
        deleteChoice,
        deleteSelection,
        updateChoice,
        updateSelection
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
        updateChoice(choice.id, input, choice.multiple);
    }

    const selectionTextChange = (e: string, id: number) => {
        console.log(e);
        updateSelection(id, e);
    }

    const deleteSelectionElem = (id: number) => {
        deleteSelection(id);
    }

    const choiceMultipleChange = (input: any) => {
        console.log(input)
        updateChoice(choice.id, choice.name, input.target.value);
        setVisible(false);
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
                footer={<span><Button type='primary' onClick={() => deleteChoice(choice.id)}>Delete this Choice</Button></span>}
            >
                <div>
                    <div>
                        <Radio.Group value={choice.multiple} onChange={choiceMultipleChange}>
                            <Radio value={true}>Multiple Selections</Radio>
                            <Radio value={false}>Single Selection</Radio>
                        </Radio.Group>
                    </div>
                    <Divider/>
                    <div className='choices-popup'>
                        {choice.selections.map(s => <span>
                            <Text editable={{onChange: (e) => selectionTextChange(e, s.id)}}>{s.text}</Text> ({s.id})
                            <DeleteFilled style={{cursor: 'pointer'}} onClick={() => deleteSelectionElem(s.id)}/>
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


export default connect(null, {
    deleteChoice,
    updateChoice,
    deleteSelection,
    updateSelection
})(AdminChoiceElem);
