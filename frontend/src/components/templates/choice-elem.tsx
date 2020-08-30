import React from 'react';
import './choice.styles.less';
import {Choice} from "../../features/templates/interface";

type ChoiceProps = {
    choice: Choice;
};

const ChoiceElem: React.FC<ChoiceProps> = (
    {
        choice
    }) => {

    return (
        <div className='choice-elem'>
            {choice.name}
        </div>
    );
};


export default ChoiceElem;
