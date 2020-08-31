import React from 'react';
import './admin-choice-elem.styles.less';
import {Category, Choice} from "../../features/templates/interface";

type ChoiceProps = {
    choice: Choice;
    category: Category;
};

const AdminChoiceElem: React.FC<ChoiceProps> = (
    {
        choice,
        category
    }) => {

    return (
        <span className='choice-elem'>
            {choice.name} ({choice.id})
        </span>
    );
};


export default AdminChoiceElem;
