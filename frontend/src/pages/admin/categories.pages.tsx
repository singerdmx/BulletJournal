import React, {useEffect} from 'react';
import './categories.styles.less';
import {BackTop} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {deleteCategory, getCategories, updateCategoryRelations} from "../../features/templates/actions";
import {Category} from "../../features/templates/interface";
import AddCategory from "../../components/modals/templates/add-category.component";

type AdminCategoriesProps = {
    categories: Category[];
    getCategories: () => void;
    updateCategoryRelations: (categories: Category[]) => void;
    deleteCategory: (id: number) => void;
};

const AdminCategoriesPage: React.FC<AdminCategoriesProps> = (
    {
        categories,
        getCategories,
        updateCategoryRelations,
        deleteCategory
    }) => {
    useEffect(() => {
        document.title = 'Bullet Journal - Categories';
        getCategories();
    }, []);

    return (
        <div className='admin-categories-page'>
            <BackTop/>
            <AddCategory/>

            {categories.map(c => {
                return <div>{c.name}</div>
            })}
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    categories: state.templates.categories
});

export default connect(mapStateToProps, {
    getCategories,
    updateCategoryRelations,
    deleteCategory
})(AdminCategoriesPage);
