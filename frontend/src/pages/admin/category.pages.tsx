import React, {useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import {connect} from "react-redux";
import {deleteCategory, getCategory, updateCategory} from "../../features/templates/actions";
import {IState} from "../../store";
import {Category} from "../../features/templates/interface";
import {BackTop, Typography} from "antd";
import {DeleteFilled} from "@ant-design/icons/lib";
import ColorPicker from "../../utils/color-picker/ColorPickr";
const { Title, Text } = Typography;

type AdminCategoryProps = {
    category: Category | undefined;
    deleteCategory: (id: number) => void;
    getCategory: (categoryId: number) => void;
    updateCategory: (categoryId: number, name: string,
                     description?: string, icon?: string, color?: string, forumId?: number) => void;
}

const AdminCategoryPage: React.FC<AdminCategoryProps> = (
    {category, getCategory, deleteCategory, updateCategory}) => {
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

    const changeColorHandler = (input: any) => {
        console.log(input);
        updateCategory(category.id, category.name, category.description, category.icon, input.color, category.forumId);
    }

    const nameChange = (input: any) => {
        console.log(input);
        updateCategory(category.id, input, category.description, category.icon, category.color, category.forumId);
    }

    const descriptionChange = (input: any) => {
        console.log(input);
        updateCategory(category.id, category.name, input, category.icon, category.color, category.forumId);
    }

    const forumIdChange = (input: any) => {
        console.log(input);
        updateCategory(category.id, category.name, category.description, category.icon, category.color,
            input ? parseInt(input) : undefined);
    }

    return <div className='admin-categories-page'>
        <BackTop/>
        <div><DeleteFilled onClick={handleDelete}/></div>
        <div style={{backgroundColor: `${category.color}`}}>
            <Title editable={{ onChange: nameChange }}>{category.name}</Title>
            <Text editable={{ onChange: descriptionChange }}>{`${category.description ? category.description : 'description'}`}</Text>
            <br/>
            <Text editable={{ onChange: forumIdChange }}>{`${category.forumId ? category.forumId : 'forumId'}`}</Text>
        </div>
        <ColorPicker
            label='Color  '
            color={category.color}
            onChange={changeColorHandler}
            mode='RGB'
        />
    </div>
}

const mapStateToProps = (state: IState) => ({
    category: state.templates.category
});

export default connect(mapStateToProps, {
    getCategory,
    deleteCategory,
    updateCategory
})(AdminCategoryPage);