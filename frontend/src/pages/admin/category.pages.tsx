import React, {useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import {connect} from "react-redux";
import {deleteCategory, getCategory} from "../../features/templates/actions";
import {IState} from "../../store";
import {Category} from "../../features/templates/interface";
import {BackTop} from "antd";
import {DeleteFilled} from "@ant-design/icons/lib";

type AdminCategoryProps = {
    category: Category | undefined;
    deleteCategory: (id: number) => void;
    getCategory: (categoryId: number) => void;
}

const AdminCategoryPage: React.FC<AdminCategoryProps> = (
    {category, getCategory, deleteCategory}) => {
    const history = useHistory();
    const {categoryId} = useParams();
    useEffect(() => {
        if (categoryId) {
            getCategory(parseInt(categoryId));
        }
    }, [categoryId]);

    if (!category) {
        return <div>{categoryId} Not Found</div>
    }

    const handleDelete = (e: any) => {
        deleteCategory(category.id);
        history.push('/admin/categories');
    }

    return <div className='admin-categories-page'>
        <BackTop/>
        <div><DeleteFilled onClick={handleDelete}/></div>
        {category.name}
    </div>
}

const mapStateToProps = (state: IState) => ({
    category: state.templates.category
});

export default connect(mapStateToProps, {
    getCategory,
    deleteCategory
})(AdminCategoryPage);