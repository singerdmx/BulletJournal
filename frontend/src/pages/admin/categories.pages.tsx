import React, {useEffect} from 'react';
import './categories.styles.less';
import {BackTop, Tree} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getCategories, updateCategoryRelations} from "../../features/templates/actions";
import AddCategory from "../../components/modals/templates/add-category.component";
import {TreeNodeNormal} from "antd/lib/tree/Tree";
import {Category} from "../../features/templates/interface";
import {useHistory} from "react-router-dom";

type AdminCategoriesProps = {
    categories: Category[];
    getCategories: () => void;
    updateCategoryRelations: (categories: Category[]) => void;
};

const AdminCategoriesPage: React.FC<AdminCategoriesProps> = (
    {
        categories,
        getCategories,
        updateCategoryRelations,
    }) => {
    const history = useHistory();

    useEffect(() => {
        document.title = 'Bullet Journal - Categories';
        getCategories();
    }, []);

    const getTree = (data: Category[]): TreeNodeNormal[] => {
        const res = [] as TreeNodeNormal[];
        data.forEach((item: Category) => {
            const node = {} as TreeNodeNormal;
            if (item.subCategories && item.subCategories.length > 0) {
                node.children = getTree(item.subCategories);
            } else {
                node.children = [] as TreeNodeNormal[];
            }
            node.title = (
                <div onClick={e => history.push(`/admin/categories/${item.id}`)}>{item.name}</div>
            );
            node.key = item.id.toString();
            res.push(node);
        });
        return res;
    };

    const findCategoryById = (categories: Category[], categoryId: number): Category => {
        let res = {} as Category;
        const searchCategory = categories.find((item) => item.id === categoryId);
        if (searchCategory) {
            res = searchCategory;
        } else {
            for (let i = 0; i < categories.length; i++) {
                const searchSubCategory = findCategoryById(categories[i].subCategories, categoryId);
                if (searchSubCategory.id) {
                    res = searchSubCategory;
                }
            }
        }
        return res;
    };

    const dropCategoryById = (
        categories: Category[],
        dropId: number,
        dropCategory: Category
    ): Category[] => {
        const res = [] as Category[];
        categories.forEach((item, index) => {
            let category = {} as Category;
            let subCategories = [] as Category[];
            if (item.id === dropId) {
                subCategories = item.subCategories;
                subCategories.push(dropCategory);
            } else {
                subCategories = dropCategoryById(item.subCategories, dropId, dropCategory);
            }
            category = {...item, subCategories: subCategories};
            res.push(category);
        });
        return res;
    };

    const dragCategoryById = (categories: Category[], categoryId: number): Category[] => {
        const res = [] as Category[];
        categories.forEach((item, index) => {
            const subCategories = dragCategoryById(item.subCategories, categoryId);
            const category = {...item, subCategories: subCategories};
            if (category.id !== categoryId) res.push(category);
        });
        return res;
    };

    const onDrop = (categories: Category[], updateCategoryRelations: Function) => (
        info: any
    ) => {
        const targetCategory = findCategoryById(categories, parseInt(info.dragNode.key));
        const dropPos = info.node.props.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
        const dragCategories = dragCategoryById(categories, parseInt(info.dragNode.key));
        const droppingIndex = info.dropPosition + 1;
        let resCategories = [] as Category[];
        if (dropPosition === -1) {
            const dragIndex = categories.findIndex((category) => category.id === targetCategory.id);
            if (dragIndex >= droppingIndex) {
                dragCategories.splice(droppingIndex, 0, targetCategory);
                resCategories = dragCategories;
            } else {
                dragCategories.splice(droppingIndex - 1, 0, targetCategory);
                resCategories = dragCategories;
            }
        } else {
            resCategories = dropCategoryById(dragCategories, parseInt(info.node.key), targetCategory);
        }
        updateCategoryRelations(resCategories);
    };

    return (
        <div className='admin-categories-page'>
            <BackTop/>
            <AddCategory/>

            <Tree
                className='ant-tree'
                draggable
                blockNode
                onDrop={onDrop(categories, updateCategoryRelations)}
                treeData={getTree(categories)}
            />
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    categories: state.templates.categories
});

export default connect(mapStateToProps, {
    getCategories,
    updateCategoryRelations,
})(AdminCategoriesPage);
