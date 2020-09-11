import React from 'react';
import "./category.styles.less";
import {Divider} from 'antd';
import {Category} from '../../features/templates/interface';
import {connect} from 'react-redux';
import {IState} from '../../store';
import {useHistory} from 'react-router-dom';
import {getIcon} from '../../components/draggable-labels/draggable-label-list.component';

type CategoryProps = {
    categories: Category[];
};

const handleOnClickCategory = (categoryId: number, history: any) => {
    history.push(`/categories/${categoryId}/steps`);
}

export const renderCategory = (c: Category, history: any) => {
    return <div className='category-info' key={c.id}
                onClick={() => handleOnClickCategory(c.id, history)} style={{backgroundColor: `${c.color}`}}>
        <div className='category-pic-div'>
            <img className='category-pic'
                 src={c.image!}/>
        </div>
        <div className='category-name'>
            <span>{getIcon(c.icon!)} {c.name}</span>
        </div>
    </div>
};

const CategoriesPage: React.FC<CategoryProps> = (
    {
        categories
    }) => {
    const history = useHistory();

    return (
        <div className='template-content'>
            return <div>
            {categories.map(c => {
                return <>
                    <Divider>
                        <span>{getIcon(c.icon!)} {c.name}</span>
                    </Divider>
                    <div className='categories-info'>
                        {c.subCategories.map(sub => {
                            return renderCategory(sub, history);
                        })}
                    </div>
                </>
            })}
        </div>
        </div>
    );

}

const mapStateToProps = (state: IState) => ({
    categories: state.templates.categories,
});

export default connect(mapStateToProps, {})(CategoriesPage);
