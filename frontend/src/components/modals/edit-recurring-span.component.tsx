import {IState} from "../../store";
import {connect} from "react-redux";
import React, {useEffect, useState} from "react";
import ReactRRuleGenerator from "../../features/recurrence/RRuleGenerator";
import {convertToTextWithRRule} from "../../features/recurrence/actions";
import {AutoComplete, Input, Select} from "antd";
import './edit-recurring-span.styles.less';

const { Option } = Select;

type RecurringSpanProps = {
    rRuleString: string,
    duration: number,
};

const EditRecurringSpan: React.FC<RecurringSpanProps> = (props) => {
    const {rRuleString, duration} = props;
    const result = ['15', '30', '45', '60'];
    const options = result.map((time: string) => {
        return { value: time };
    });

    const [rRuleText, setRRuleText] = useState(
        convertToTextWithRRule(rRuleString)
    );
    const [last, setLast] = useState(duration % 60 === 0 ? (duration / 60).toString() : duration.toString());
    const [unit, setUnit] = useState(duration % 60 === 0 ? 'Hours' : 'Minutes');

    useEffect(() => {
        setRRuleText(convertToTextWithRRule(rRuleString));
    }, [rRuleString]);

    return <div>
        <div
            style={{
                borderBottom: '1px solid #E8E8E8',
            }}
        >
            <div className="recurrence-title">{rRuleText}</div>
            <ReactRRuleGenerator/>
        </div>
        <div className='duration-div'>
            <div className='last'>
                Last for&nbsp;&nbsp;
            </div>
            <div>
                <AutoComplete
                    placeholder="Duration"
                    options={options} value={last}
                    onChange={(e) => {
                        let num = parseInt(e);
                        if (isNaN(num)) {
                            num = 0;
                        }
                        setLast(num.toString());
                    }}>
                    <Input style={{width: '100px'}}/>
                </AutoComplete>
            </div>
            &nbsp;
            <div>
                <Select defaultValue={unit}>
                    <Option value="Minutes">Minute(s)</Option>
                    <Option value="Hours">Hour(s)</Option>
                </Select>
            </div>
        </div>
    </div>
}
const mapStateToProps = (state: IState) => ({
    groups: state.group.groups,
    rRuleString: state.rRule.rRuleString,
});

export default connect(mapStateToProps, {})
(EditRecurringSpan);
