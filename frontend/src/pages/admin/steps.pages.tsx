import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {connect} from "react-redux";
import {getCategory} from "../../features/templates/actions";
import {IState} from "../../store";
import {Category} from "../../features/templates/interface";
import {BackTop, Typography} from "antd";
import './steps.styles.less'
import {Container} from "react-floating-action-button";
import AddStep from "../../components/modals/templates/add-step.component";

const {Title, Text} = Typography;

type AdminStepsProps = {
    category: Category | undefined;
}

const AdminStepsPage: React.FC<AdminStepsProps> = (
    {category}) => {

    const {categoryId} = useParams();
    useEffect(() => {
        if (categoryId) {
            getCategory(parseInt(categoryId));
        }
    }, [categoryId]);

    if (!category) {
        return <div>{categoryId} Not Found</div>
    }

    return <div className='steps-page'>
        <BackTop/>
        <h2>{category.name}</h2>
        <Container>
            <AddStep/>
        </Container>
    </div>
}

const mapStateToProps = (state: IState) => ({
    category: state.templates.category
});

export default connect(mapStateToProps, {
    getCategory,
})(AdminStepsPage);