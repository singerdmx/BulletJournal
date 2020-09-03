import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { Route, Switch } from 'react-router-dom';
import categoryPage from '../../pages/templates/category.page';
import StepsPage from '../../pages/templates/steps.pages';


const { Content } = Layout;
type ContentProps = {};

const ContentLayout: React.FC<ContentProps> = () => {

    return (
        <Content className='content'>
            <Switch>
                <Route exact path='/' component={categoryPage} />
                <Route exact path='/categories/:categoryId/steps' component={StepsPage} />
            </Switch>
        </Content>
    );
}


export default ContentLayout;
