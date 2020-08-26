import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {connect} from "react-redux";
import {deleteCategory, getCategory, updateCategory} from "../../features/templates/actions";
import {IState} from "../../store";
import {Category} from "../../features/templates/interface";
import {BackTop, Col, Popover, Row, Typography} from "antd";
import {DeleteFilled, TagOutlined} from "@ant-design/icons/lib";
import ColorPicker from "../../utils/color-picker/ColorPickr";
import {icons} from "../../assets/icons";
import './categories.styles.less'
import {getIcon} from "../../components/draggable-labels/draggable-label-list.component";

const {Title, Text} = Typography;

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
    const [formUpdateLabelIcon, setFormUpdateLabelIcon] = useState(
        <TagOutlined/>
    );
    const [formUpdateLabelIconString, setFormUpdateLabelIconString] = useState(
        'TagOutlined'
    );
    const {categoryId} = useParams();
    useEffect(() => {
        if (categoryId) {
            getCategory(parseInt(categoryId));
        }
    }, [categoryId]);

    useEffect(() => {
        if (category && category.icon) {
            setFormUpdateLabelIcon(getIcon(category.icon));
            setFormUpdateLabelIconString(category.icon);
        }
    }, [category]);

    if (!category) {
        return <div>{categoryId} Not Found</div>
    }

    const IconsSelector = () => {
        return (
            <div key='category-update-icon' className='label-icon-selector'>
                <Row key='category-update-icon-row'>
                    {icons.map((icon: any) => {
                        return (
                            <Col span={2} key={icon.name}>
                                <span
                                    key={`category-update-icon-${icon.name}`}
                                    title={icon.name}
                                    onClick={() => {
                                        setFormUpdateLabelIcon(icon.icon);
                                        setFormUpdateLabelIconString(icon.name);
                                        iconChange(icon.name);
                                    }}
                                >
                                  {icon.icon}
                                </span>
                            </Col>
                        );
                    })}
                </Row>
            </div>
        );
    };

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

    const iconChange = (input: any) => {
        updateCategory(category.id, category.name, category.description, input, category.color, category.forumId);
    }

    return <div className='admin-categories-page'>
        <BackTop/>
        <div><DeleteFilled onClick={handleDelete}/></div>
        <div style={{backgroundColor: `${category.color}`}}>
            <Popover
                title='Select an icon for your label'
                placement='right'
                content={<IconsSelector />}
                style={{ width: '800px' }}
            >
                <div className='label-icon'>{formUpdateLabelIcon}</div>
            </Popover>
            <Title editable={{onChange: nameChange}}>{category.name}</Title>
            <Text
                editable={{onChange: descriptionChange}}>{`${category.description ? category.description : 'description'}`}</Text>
            <br/>
            <Text editable={{onChange: forumIdChange}}>{`${category.forumId ? category.forumId : 'forumId'}`}</Text>
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