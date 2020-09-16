import React, {useEffect} from 'react';
import "./category.styles.less";
import {Empty, PageHeader} from 'antd';
import {Category} from '../../features/templates/interface';
import {connect} from 'react-redux';
import {IState} from '../../store';
import {getCategory} from "../../features/templates/actions";
import {useHistory, useParams} from 'react-router-dom';
import {getIcon} from '../../components/draggable-labels/draggable-label-list.component';
import {renderCategory} from "./categories.page";

type CategoryProps = {
    category: Category | undefined;
    getCategory: (categoryId: number) => void;
};

const CategoryPage: React.FC<CategoryProps> = (
    {
        getCategory,
        category,
    }) => {
    const {categoryId} = useParams();

    useEffect(() => {
        if (categoryId) {
            getCategory(parseInt(categoryId));
        }
    }, [categoryId]);

    useEffect(() => {
        document.title = category ? category.name : 'Templates';
    }, [category]);

    const history = useHistory();

    if (!category) {
        return <div>
            <Empty/>
        </div>
    }

    return (<div className='template-content'>
        <PageHeader
            title={category.name}
            tags={getIcon(category.icon!)}/>
        <div className='categories-info'>
            {category.subCategories.map(c => {
                return renderCategory(c, history);
            })}
        </div>
    </div>)
};

const mapStateToProps = (state: IState) => ({
    category: state.templates.category
});

export default connect(mapStateToProps, {
    getCategory
})(CategoryPage);
