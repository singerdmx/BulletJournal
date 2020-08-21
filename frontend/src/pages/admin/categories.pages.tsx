import React, {useEffect} from 'react';
import './categories.less';
import {BackTop} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getCategories} from "../../features/templates/actions";
import {Category} from "../../features/templates/interface";

type AdminCategoriesProps = {
    categories: Category[];
    getCategories: () => void;
};

const AdminCategoriesPage: React.FC<AdminCategoriesProps> = (
    {
        categories,
        getCategories
    }) => {
    useEffect(() => {
        document.title = 'Bullet Journal - Categories';
        getCategories();
    }, []);

    return (
        <div className='admin-categories-page'>
            <BackTop/>

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
    getCategories
})(AdminCategoriesPage);
