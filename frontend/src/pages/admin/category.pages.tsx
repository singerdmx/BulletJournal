import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {connect} from "react-redux";
import {
    deleteCategory,
    deleteRule,
    getCategory,
    setCategoryChoices,
    updateCategory
} from "../../features/templates/actions";
import {IState} from "../../store";
import {Category} from "../../features/templates/interface";
import {BackTop, Button, Checkbox, Col, Divider, Popover, Row, Tag, Tooltip, Typography} from "antd";
import {DeleteFilled, DeleteTwoTone, TagOutlined} from "@ant-design/icons/lib";
import ColorPicker from "../../utils/color-picker/ColorPickr";
import {icons} from "../../assets/icons";
import './categories.styles.less'
import {getIcon} from "../../components/draggable-labels/draggable-label-list.component";
import AdminChoiceElem from "./admin-choice-elem";
import AdminChoices from "./admin-choices";
import {Container} from "react-floating-action-button";
import AddRule from "../../components/modals/templates/add-rule.component";

const {Title, Text} = Typography;

type AdminCategoryProps = {
    category: Category | undefined;
    deleteCategory: (id: number) => void;
    getCategory: (categoryId: number) => void;
    updateCategory: (categoryId: number, name: string, needStartDate: boolean,
                     description?: string, icon?: string,
                     color?: string, forumId?: number,
                     image?: string, nextStepId?: number) => void;
    setCategoryChoices: (id: number, choices: number[]) => void;
    deleteRule: (ruleId: number, ruleType: string) => void;
}

const AdminCategoryPage: React.FC<AdminCategoryProps> = (
    {category, getCategory, deleteCategory, updateCategory, setCategoryChoices, deleteRule}) => {
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
        updateCategory(category.id, category.name, category.needStartDate, category.description, category.icon,
            input.color, category.forumId, category.image, category.nextStepId);
    }

    const nameChange = (input: any) => {
        console.log(input);
        updateCategory(category.id, input, category.needStartDate, category.description, category.icon,
            category.color, category.forumId, category.image, category.nextStepId);
    }

    const descriptionChange = (input: any) => {
        console.log(input);
        updateCategory(category.id, category.name, category.needStartDate, input, category.icon,
            category.color, category.forumId, category.image, category.nextStepId);
    }

    const forumIdChange = (input: any) => {
        console.log(input);
        updateCategory(category.id, category.name, category.needStartDate, category.description, category.icon, category.color,
            input ? parseInt(input) : undefined, category.image, category.nextStepId);
    }

    const nextStepIdChange = (input: any) => {
        console.log(input);
        updateCategory(category.id, category.name, category.needStartDate, category.description, category.icon, category.color,
            category.forumId, category.image, input ? parseInt(input) : undefined);
    }

    const imageChange = (input: any) => {
        console.log(input);
        updateCategory(category.id, category.name, category.needStartDate, category.description, category.icon, category.color,
            category.forumId, input, category.nextStepId);
    }

    const iconChange = (input: any) => {
        updateCategory(category.id, category.name, category.needStartDate, category.description, input,
            category.color, category.forumId, category.image, category.nextStepId);
    }

    const deleteChoice = (category: Category, id: number) => {
        setCategoryChoices(category.id, category.choices.map(c => c.id).filter(c => c !== id));
    }

    const addChoice = (category: Category, id: number) => {
        const choices = category.choices.map(c => c.id);
        choices.push(id);
        setCategoryChoices(category.id, choices);
    }

    const onChangeNeedStartDate = (value: any) => {
        console.log(value.target.checked);
        updateCategory(category.id, category.name, value.target.checked, category.description, category.icon, category.color,
            category.forumId, category.image, category.nextStepId);
    }

    return <div className='admin-categories-page'>
        <BackTop/>
        <div><DeleteFilled onClick={handleDelete}/></div>
        <div style={{backgroundColor: `${category.color}`}}>
            <Popover
                title='Select an icon for your label'
                placement='right'
                content={<IconsSelector/>}
                style={{width: '800px'}}
            >
                <div className='label-icon'>{formUpdateLabelIcon}</div>
            </Popover>
            <Title editable={{onChange: nameChange}}>{category.name}</Title>
            <Text
                editable={{onChange: descriptionChange}}>{`${category.description ? category.description : 'description'}`}</Text>
            <br/>
            <Text editable={{onChange: forumIdChange}}>{`${category.forumId ? category.forumId : 'forumId'}`}</Text>
            <br/>
            <Text
                editable={{onChange: nextStepIdChange}}>{`${category.nextStepId ? category.nextStepId : 'nextStepId'}`}</Text>
            <br/>
            <Text editable={{onChange: imageChange}}>{`${category.image ? category.image : 'Image URL'}`}</Text>
            <br/>
            <Checkbox checked={category.needStartDate} onChange={onChangeNeedStartDate}>Need Start Date</Checkbox>
        </div>
        <div>
            {category.image && <img src={category.image} width='300px' style={{padding: '10px'}}/>}
        </div>
        <ColorPicker
            label='Color  '
            color={category.color}
            onChange={changeColorHandler}
            mode='RGB'
        />
        <Divider/>
        <div>
            <h3>Choices</h3>
            {category.choices.map(c => {
                return <div>
                    <AdminChoiceElem c={c}/>
                    {' '}
                    <Tooltip title='Remove Choice'>
                        <DeleteTwoTone style={{cursor: 'pointer'}} onClick={() => deleteChoice(category, c.id)}/>
                    </Tooltip>
                </div>
            })}
            <Divider/>
            <div>
                <h3>Available Choices to add</h3>
                <AdminChoices
                    showAddChoice={true}
                    addChoice={(id) => addChoice(category, id)}
                    choicesToExclude={category.choices.map(c => c.id)}/>
            </div>
            <Divider/>
            <div>
                <h3>Rules</h3>
                {category && category.rules && category.rules.map(rule => {
                    return <div><span>
                        <Tag>{rule.ruleExpression}</Tag> [{rule.name}] (Priority: {rule.priority}, ID: {rule.id})</span>
                        {' '} <span style={{cursor: 'pointer', color: 'lightBlue'}} onClick={() => history.push(`/admin/steps/${rule.connectedStep.id}`)}>
                            Step: {rule.connectedStep.name} ({rule.connectedStep.id})</span>
                        <DeleteTwoTone onClick={() => deleteRule(rule.id, 'CATEGORY_RULE')}/>
                    </div>
                })}
            </div>
            <Divider/>
            <div>
                <Button type='primary'
                        onClick={() => history.push(`/admin/categories/${categoryId}/steps`)}>
                    Go to Steps
                </Button>
            </div>
            <Container>
                <AddRule step={undefined} category={category}/>
            </Container>
        </div>
    </div>
}

const mapStateToProps = (state: IState) => ({
    category: state.templates.category
});

export default connect(mapStateToProps, {
    getCategory,
    deleteCategory,
    updateCategory,
    setCategoryChoices,
    deleteRule
})(AdminCategoryPage);