import {IState} from "../../store";
import {connect} from "react-redux";
import React, {useEffect, useState} from "react";
import ReactRRuleGenerator from "../../features/recurrence/RRuleGenerator";
import {convertToTextWithRRule} from "../../features/recurrence/actions";

type RecurringSpanProps = {
    rRuleString: string,
    duration: number,
};

const EditRecurringSpan: React.FC<RecurringSpanProps> = (props) => {
    const {rRuleString} = props;

    const [rRuleText, setRRuleText] = useState(
        convertToTextWithRRule(rRuleString)
    );

    useEffect(() => {
        setRRuleText(convertToTextWithRRule(rRuleString));
    }, [rRuleString]);

    return <div
        style={{
            borderTop: '1px solid #E8E8E8',
            borderBottom: '1px solid #E8E8E8',
            paddingTop: '24px',
            marginBottom: '24px',
        }}
    >
        <div className="recurrence-title">{rRuleText}</div>
        {/*TODO add Duration*/}
        <ReactRRuleGenerator />
    </div>
}
const mapStateToProps = (state: IState) => ({
    groups: state.group.groups,
});

export default connect(mapStateToProps, {})
(EditRecurringSpan);
