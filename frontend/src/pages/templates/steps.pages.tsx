import React, {useEffect} from 'react';
import './steps.styles.less';
import {useParams} from "react-router-dom";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getCategory} from "../../features/templates/actions";
import {Category} from "../../features/templates/interface";
import {Card, Empty, Select} from "antd";

const {Meta} = Card;
const {Option} = Select;

type StepsProps = {
    category: Category | undefined;
    getCategory: (categoryId: number) => void;
};

const StepsPage: React.FC<StepsProps> = (
    {category, getCategory}
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

    if (!category) {
        return <Empty/>
    }

    const getComingSoonDiv = () => {
        if (category && category.choices.length > 0) {
            return null;
        }
        return <div className='coming-soon'>
            <img alt='Coming Soon'
                 src='https://user-images.githubusercontent.com/122956/92905797-d299c600-f3d8-11ea-813a-3ac75c2f5677.gif'/>
        </div>
    }

    const getStepsDiv = () => {
        if (!category || category.choices.length === 0) {
            return null;
        }
        return <div>
            <div>
                <div className='choices-card'>
                    {category.choices.map(choice => {
                        return <div key={choice.id} className='choice-card'>
                            <Select mode={choice.multiple ? 'multiple' : undefined}
                                    placeholder={choice.name}
                                    style={{padding: '3px'}}
                                    allowClear>
                                {choice.selections.map(selection => {
                                    return <Option key={selection.id} value={selection.id}>{selection.text}</Option>
                                })}
                            </Select>
                        </div>
                    })}
                </div>
            </div>
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
            {getComingSoonDiv()}
            {getStepsDiv()}
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    category: state.templates.category
});

export default connect(mapStateToProps, {
    getCategory
})(StepsPage);
