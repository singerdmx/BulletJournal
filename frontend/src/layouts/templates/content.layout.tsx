import React from 'react';
import {Layout} from 'antd';
import {Route, Switch} from 'react-router-dom';
import StepsPage from '../../pages/templates/steps.pages';
import CategoriesPage from "../../pages/templates/categories.page";
import CategoryPage from "../../pages/templates/category.page";

const {Content} = Layout;
type ContentProps = {};

const ContentLayout: React.FC<ContentProps> = () => {

    return (
        <Content className='content'>
            <Switch>
                <Route exact path='/' component={CategoriesPage}/>
                <Route exact path='/categories/:categoryId' component={CategoryPage}/>
                <Route exact path='/categories/:categoryId/steps' component={StepsPage}/>
            </Switch>
        </Content>
    );
}


export default ContentLayout;
