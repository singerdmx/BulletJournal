import React, {useEffect} from 'react';
import './steps.styles.less';
import {useParams} from "react-router-dom";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getCategory, getNextStep} from "../../features/templates/actions";
import {Category, Choice, NextStep, Step} from "../../features/templates/interface";
import {Card, Empty, Select} from "antd";
import {isSubsequence, onFilterAssignees} from "../../utils/Util";
import {CloseSquareTwoTone} from "@ant-design/icons";

const {Meta} = Card;
const {Option} = Select;

type StepsProps = {
    category: Category | undefined;
    nextStep: NextStep | undefined;
    getCategory: (categoryId: number) => void;
    getNextStep: (stepId: number, selections: number[], first?: boolean) => void;
};

const STEPS = 'steps';
const SELECTIONS = 'selections';

const StepsPage: React.FC<StepsProps> = (
    {category, nextStep, getCategory, getNextStep}
) => {
    const {categoryId} = useParams();

    useEffect(() => {
        if (categoryId) {
            getCategory(parseInt(categoryId));
        }
    }, [categoryId]);

    useEffect(() => {
        document.title = 'Bullet Journal - Steps';
        if (category) {
            document.title = category.name;
        }
    }, [category]);

    useEffect(() => {
        if (nextStep && nextStep.step) {
            const steps = getSteps();
            steps.push(nextStep.step);
            localStorage.setItem(STEPS, JSON.stringify(steps));
        }
    }, [nextStep]);

    if (!category) {
        return <Empty/>
    }

    const getComingSoonDiv = () => {
        if (!category) {
            return null;
        }
        if ((nextStep && nextStep.step === null) || (category.choices.length === 0)) {
            return <div className='coming-soon'>
                <img alt='Coming Soon'
                     src='https://user-images.githubusercontent.com/122956/92905797-d299c600-f3d8-11ea-813a-3ac75c2f5677.gif'/>
            </div>
        }
        return null;
    }

    const getSteps = () => {
        const steps: Step[] = JSON.parse(localStorage.getItem(STEPS) || '[]');
        return steps;
    }

    const getCurrentStep = () => {
        if (nextStep && nextStep.step) {
            return nextStep.step;
        }
        const steps = getSteps();
        return steps[steps.length - 1];
    }

    const getSelections = () => {
        const selectionsText = localStorage.getItem(SELECTIONS);
        const selections: any = selectionsText ? JSON.parse(selectionsText) : {};
        return selections;
    }

    const onChoiceChange = (e: any, choice: Choice) => {
        console.log(e);

        const selections = getSelections();
        selections[choice.id] = e ? (Array.isArray(e) ? e : [e]) : null;
        localStorage.setItem(SELECTIONS, JSON.stringify(selections));

        const curStep = getCurrentStep();
        if (curStep.choices.every(c => selections[c.id])) {
            let selected: number[] = [];
            curStep.choices.forEach(c => {
                selected = selected.concat(selections[c.id]);
            });
            getNextStep(curStep.id, selected, getSteps().length === 1);
        }
    }

    const onFilterChoices = (inputValue: string, option: any) => {
        inputValue = inputValue.toLowerCase();
        return isSubsequence(option.key.toString().toLowerCase(), inputValue);
    };

    const renderChoice = (choice: Choice) => {
        const selections = getSelections();
        return <div key={choice.id} className='choice-card'>
            <Select mode={choice.multiple ? 'multiple' : undefined}
                    clearIcon={<CloseSquareTwoTone />}
                    showSearch={true}
                    filterOption={(e, t) => onFilterChoices(e, t)}
                    onChange={(e) => onChoiceChange(e, choice)}
                    placeholder={choice.name}
                    defaultValue={selections[choice.id] ? selections[choice.id] : []}
                    style={{padding: '3px', minWidth: '60%'}}
                    allowClear>
                {choice.selections.map(selection => {
                    return <Option key={selection.text} value={selection.id}>{selection.text}</Option>
                })}
            </Select>
        </div>
    }

    const getStepsDiv = () => {
        if (!category || category.choices.length === 0) {
            return null;
        }

        const existingSteps = getSteps();
        if (existingSteps.length > 0) {
            if (existingSteps[0].id !== category.id) {
                localStorage.removeItem(STEPS);
                localStorage.removeItem(SELECTIONS);
            } else {
                return <div className='choices-card'>
                    {getCurrentStep().choices.map(choice => {
                        return renderChoice(choice);
                    })}
                </div>
            }
        }

        const steps: Step[] = [{...category, excludedSelections: []}];
        localStorage.setItem(STEPS, JSON.stringify(steps));
        return <div className='choices-card'>
            {category.choices.map(choice => {
                return renderChoice(choice);
            })}
        </div>
    }

    return (
        <div className='steps-page'>
            <div className='steps-info'>
                <Card
                    className='category'
                    style={{backgroundColor: `${category.color}`}}
                    cover={
                        <img alt={category.name} src={category.image}/>
                    }
                >
                    <Meta
                        title={category.name}
                        description={category.description}
                    />
                </Card>
            </div>
            {getStepsDiv()}
            {getComingSoonDiv()}
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    category: state.templates.category,
    nextStep: state.templates.nextStep,
});

export default connect(mapStateToProps, {
    getCategory,
    getNextStep
})(StepsPage);
