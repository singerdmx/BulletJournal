import React, {useEffect, useState} from 'react';
import {Layout} from 'antd';
import {IState} from "./store";
import {connect} from "react-redux";
import {getCategories} from "./features/templates/actions";
import {Category} from "./features/templates/interface";
import FooterLayout from "./layouts/footer/footer.layout";
import SideLayout from './layouts/templates/side.layout';
import ContentLayout from './layouts/templates/content.layout';


type TemplatesProps = {
    category: Category | undefined;
    getCategories: () => void;
};

const TemplatesPage: React.FC<TemplatesProps> = (
    {
        category,
        getCategories,
    }) => {

    const isMobilePage = () => {
        return window.navigator.userAgent.toLowerCase().includes('mobile');
    }

    useEffect(() => {
        document.title = category ? `Templates - ${category.name}` : 'Templates';
        getCategories();
        if (isMobilePage()) {
            setCollapsed(true);
            setWidth(collapsedSiderWidth);
        }
    }, [category]);

    const expandedSiderWidth = 240;
    const collapsedSiderWidth = 55;
    const [collapsed, setCollapsed] = useState(false);
    const [width, setWidth] = useState(expandedSiderWidth);

    const onCollapse = (collapsed: boolean) => {
        setCollapsed(collapsed);
        if (collapsed) {
            setWidth(collapsedSiderWidth);
        } else {
            setWidth(expandedSiderWidth);
        }
    }

    return (
        <Layout style={{minHeight: '100vh'}}>
            <SideLayout collapsedSiderWidth={collapsedSiderWidth} width={width}
                 onCollapse={onCollapse} collapsed={collapsed}></SideLayout>
            <Layout style={{marginLeft: `${width}px`}}>
                <ContentLayout></ContentLayout>
                {!isMobilePage() && <FooterLayout/>}
            </Layout>
        </Layout>
    )
};

const mapStateToProps = (state: IState) => ({
    category: state.templates.category
});

export default connect(mapStateToProps, {
    getCategories
})(TemplatesPage);
