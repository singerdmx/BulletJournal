import React, {useEffect} from 'react';
import './admin-choice.styles.less';
import {Choice} from "../../features/templates/interface";
import {IState} from "../../store";
import {connect} from "react-redux";
import AdminChoiceElem from "./admin-choice-elem";
import {getChoices} from "../../features/templates/actions";
import {PlusCircleTwoTone} from "@ant-design/icons";
import {Tooltip} from "antd";

type Choices = {
    choices: Choice[];
    choicesToExclude: number[];
    showAddChoice: boolean;
    getChoices: () => void;
    addChoice: (choiceId: number) => void;
};

const AdminChoices: React.FC<Choices> = (
    {
        choices,
        showAddChoice,
        getChoices,
        addChoice,
        choicesToExclude
    }) => {

    useEffect(() => {
        getChoices();
    }, []);

    return (
        <div>
            {choices.filter(c => !choicesToExclude.includes(c.id)).map(c => {
                return <div>
                    <AdminChoiceElem c={c} />
                    {showAddChoice && <Tooltip title='Add Choice'>
                        <PlusCircleTwoTone onClick={() => addChoice(c.id)}/>
                    </Tooltip>}
                </div>
            })}
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    choices: state.templates.choices
});

export default connect(mapStateToProps, {
    getChoices,
})(AdminChoices);
