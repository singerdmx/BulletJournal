import React, {useEffect, useState} from 'react';
import './workflow.styles.less';
import {Button, Divider, Input} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {addSelection, getChoices} from "../../features/templates/actions";
import {Choice} from "../../features/templates/interface";
import AdminChoiceElem from "./admin-choice-elem";
import {useHistory} from "react-router-dom";

type WorkflowPageProps = {
    choices: Choice[];
    getChoices: () => void;
    addSelection: (choiceId: number, text: string) => void;
};

const AdminWorkflowChoices: React.FC<WorkflowPageProps> = (
    {
        choices,
        getChoices,
        addSelection,
    }) => {
    const history = useHistory();

    useEffect(() => {
        getChoices();
    }, []);
    const [choice, setChoice] = useState(choices[0]);
    const [selectionText, setSelectionText] = useState('');

    if (choices.length === 0) {
        return <div></div>
    }
    return (<div>
            <div>
                <h3>Choices</h3>
                {choices.map(c => {
                    return <div onClick={() => setChoice(c)}>
                        <AdminChoiceElem
                            choice={c}/>
                    </div>
                })}
            </div>
            <Divider/>
            <div>
                <h3>Selection</h3>
                <div>
                    <b>Target Choice: {choice ? `${choice.name} (${choice.id})` : 'None'}</b>
                </div>
                <div>
                    Add Selection:{' '}
                    <span>
                                <Input allowClear
                                       onChange={(e) => setSelectionText(e.target.value)}
                                       value={selectionText}
                                       style={{width: '140px'}} placeholder='Selection Text'></Input>
                            </span>
                    {' '}
                    <Button type='primary' onClick={() => addSelection(choice.id, selectionText)}>
                        Add to Target Choice</Button>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    choices: state.templates.choices,
});

export default connect(mapStateToProps, {
    getChoices,
    addSelection,
})(AdminWorkflowChoices);
