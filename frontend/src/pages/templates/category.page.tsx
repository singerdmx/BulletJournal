import React from 'react';
import "./category.styles.less";
import { PageHeader } from 'antd';
import { Category } from '../../features/templates/interface';
import { connect } from 'react-redux';
import { IState } from '../../store';
import {getCategory} from "../../features/templates/actions";
import { useHistory } from 'react-router-dom';
import { getIcon } from '../../components/draggable-labels/draggable-label-list.component';

type CategoryProps = {
    category: Category | undefined;
};

const CategoryPage: React.FC<CategoryProps> = ({
    category
}) => {
    const history = useHistory();
    const handleOnClickCategory = (categoryId: number) => {
        history.push(`/categories/${categoryId}/steps`);
    }

    const getTemplates = () => {
        if (!category) {
            return <div></div>
        }
        return <>
            <PageHeader
                title={category.name}
                tags={getIcon(category.icon!)}/>
            <div className='categories-info'>
                {category.subCategories.map(c => {
                    return <div className='category-info' key={c.id}
                                onClick={() => handleOnClickCategory(c.id)} style={{backgroundColor: `${c.color}`}}>
                        <div className='category-pic-div'>
                            <img className='category-pic'
                                 src={c.image!}/>
                        </div>
                        <div className='category-name'>
                            <span>{getIcon(c.icon!)} {c.name}</span>
                        </div>
                    </div>
                })}
            </div>
        </>
    }

    return (
        <div className='template-content'>
            {getTemplates()}
        </div>
    );
  
}

const mapStateToProps = (state: IState) => ({
    category: state.templates.category
});

export default connect(mapStateToProps, {
    getCategory
})(CategoryPage);
